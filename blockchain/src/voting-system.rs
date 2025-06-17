#![no_std]

#[allow(unused_imports)]

mod storage;
use multiversx_sc::imports::*;
use storage::{VotingCampaign, VotingCampaignView, VotingCampaignDetails};

#[multiversx_sc::contract]
pub trait VotingSystem: storage::VotingStorage {
    #[init]
    fn init(&self) {
        self.owner().set(self.blockchain().get_caller());
    }

    #[upgrade]
    fn upgrade(&self) {}

    #[endpoint(createCampaign)]
    fn create_campaign(
        &self, 
        title: ManagedBuffer,
        description: ManagedBuffer,
        start_timestamp: u64,
        end_timestamp: u64,
        eligible_voters: ManagedVec<ManagedAddress>,
        options: ManagedVec<ManagedBuffer>,
        is_confidential: bool,
        is_sponsored: bool,
    ) {
        let options_num = options.len();
        require!(
            options_num >= 2,
            "Must have at least 2 options for voting"
        );
        require!(
            end_timestamp > start_timestamp,
            "End time must be after start time"
        );

        let caller = self.blockchain().get_caller();
        let campaign_id = self.num_campaigns().get();

        let mut eligible_voters_per_campaign = self.eligible_voters_per_campaign(campaign_id);
        for voter in eligible_voters.iter() {
            eligible_voters_per_campaign.insert(voter.clone(), false);
        }

        let campaign = VotingCampaign {
            campaign_id,
            owner: caller.clone(),
            title,
            description,
            start_timestamp,
            end_timestamp,
            options,
            votes: ManagedVec::new(),
            is_tallied: false,
            is_confidential,
            is_sponsored,
        };

        self.campaigns(campaign_id).set(campaign);
        self.num_campaigns().set(campaign_id + 1);
        self.create_transaction_event(campaign_id, caller);
    }

    #[endpoint(vote)]
    fn vote(
        &self,
        campaign_id: u64,
        option: u8,
    ) {
        let caller = self.blockchain().get_caller();
        let mut campaign = self.campaigns(campaign_id).get();

        require!(
            self._is_voting_active(campaign_id),
            "Voting is not active"
        );

        let options_num = campaign.options.len();
        require!(
            option < options_num as u8,
            "Invalid option"
        );

        let mut eligible_voters = self.eligible_voters_per_campaign(campaign_id);
        let is_eligible = eligible_voters.contains_key(&caller);
        require!(is_eligible, "Not eligible to vote");

        let has_voted = eligible_voters.get(&caller).unwrap();
        require!(!has_voted, "Already voted");

        // Mark as voted
        eligible_voters.insert(caller.clone(), true);

        // Store the vote
        campaign.votes.push(option);
        self.campaigns(campaign_id).set(campaign);
    }

    #[endpoint(closeCampaign)]
    fn close_campaign(&self, campaign_id: u64) {
        let caller = self.blockchain().get_caller();
        let mut campaign = self.campaigns(campaign_id).get();

        require!(caller == campaign.owner, "Only owner can tally votes");
        require!(!campaign.is_tallied, "Votes already tallied");

        campaign.is_tallied = true;
        self.campaigns(campaign_id).set(campaign);
    }

    // #######################################################
    // ################## PRIVATE FUNCTIONS ##################
    // #######################################################
    fn _is_voting_active(
        &self,
        campaign_id: u64,
    ) -> bool {
        let current_timestamp = self.blockchain().get_block_timestamp();
        let campaign = self.campaigns(campaign_id).get();

        current_timestamp >= campaign.start_timestamp
            && current_timestamp <= campaign.end_timestamp
            && !campaign.is_tallied
    }

    fn check_eligible_voter(
        &self,
        voter: ManagedAddress,
        campaign_id: u64,
    ) -> bool {
        let eligible_voters_per_campaign = self.eligible_voters_per_campaign(campaign_id);
        eligible_voters_per_campaign.get(&voter).unwrap_or(false)
    }

    fn get_eligible_voters_array(
        &self,
        campaign_id: u64,
    ) -> ManagedVec<Self::Api, ManagedAddress<Self::Api>> {
        let eligible_voters = self.eligible_voters_per_campaign(campaign_id);
        let mut eligible_voters_vec: ManagedVec<Self::Api, ManagedAddress<Self::Api>> = ManagedVec::new();
        for voter in eligible_voters.keys() {
            eligible_voters_vec.push(voter.clone());
        }
        eligible_voters_vec
    }

    fn tally_votes(&self, campaign: VotingCampaign<Self::Api>) -> ManagedVec<Self::Api, u64> {
        let options_num = campaign.options.len();
    
        let mut counts: ManagedVec<Self::Api, u64> = ManagedVec::new();
        for _ in 0..options_num {
            counts.push(0u64);
        }
    
        for option in campaign.votes.iter() {
            let index = option as usize;
            require!(index < options_num, "Invalid vote option");
            let current = counts.get(index);
            counts.set(index, current + 1).unwrap_or_else(|err| {
                panic!("Failed to update vote count: {:?}", err);
            });
        }
    
        counts
    }

    // ####################################################
    // ################## VIEW FUNCTIONS ##################
    // ####################################################
    #[view(getTalliedVotes)]
    fn get_tallied_votes(&self, campaign_id: u64) -> ManagedVec<Self::Api, u64> {
        let campaign = self.campaigns(campaign_id).get();
        require!(campaign.is_tallied, "Campaign not marked as tallied yet");

        self.tally_votes(campaign)
    }

    #[view(getAllCampaigns)]
    fn get_all_campaigns(&self) -> ManagedVec<VotingCampaignView<Self::Api>> {
        let num_campaigns = self.num_campaigns().get();
        let mut campaigns = ManagedVec::new();

        for i in 0..num_campaigns {
            let campaign = self.campaigns(i).get();
            let eligible_voters = self.get_eligible_voters_array(i);
            campaigns.push(VotingCampaignView{
                campaign_id: campaign.campaign_id,
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                start_timestamp: campaign.start_timestamp,
                end_timestamp: campaign.end_timestamp,
                votes_num: campaign.votes.len() as u64,
                eligible_voters: eligible_voters,
                is_tallied: campaign.is_tallied,
                is_confidential: campaign.is_confidential,
                is_sponsored: campaign.is_sponsored,
            });
        }

        campaigns
    }

    #[view(getCampaignById)]
    fn get_campaign_by_id(&self, campaign_id: u64) -> VotingCampaignDetails<Self::Api> {
        let campaign = self.campaigns(campaign_id).get();
        let eligible_voters = self.get_eligible_voters_array(campaign_id);
        
        VotingCampaignDetails{
            campaign_id: campaign.campaign_id,
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            options: campaign.options.clone(),
            start_timestamp: campaign.start_timestamp,
            end_timestamp: campaign.end_timestamp,
            votes: campaign.votes.clone(),
            eligible_voters,
            is_tallied: campaign.is_tallied,
            is_confidential: campaign.is_confidential,
            is_sponsored: campaign.is_sponsored,
        }
    }

    #[view(isCampaignActive)]
    fn is_voting_active(
        &self,
        campaign_id: u64,
    ) -> bool {
        self._is_voting_active(campaign_id)
    }

    /// Events
    #[event("createCampaignEvent")]
    fn create_transaction_event(
        &self,
        #[indexed] campaign_id: u64,
        #[indexed] owner: ManagedAddress,
      );
}