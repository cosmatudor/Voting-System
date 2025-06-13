use multiversx_sc::imports::*;
use multiversx_sc::derive_imports::*;
use multiversx_sc::api::StorageMapperApi;
use multiversx_sc::storage::StorageKey;

#[type_abi]
#[derive(Debug, NestedEncode, NestedDecode, TopEncode, TopDecode, Clone, ManagedVecItem)]
pub struct VotingCampaign<SA>
where
    SA: StorageMapperApi,
     {
    pub campaign_id: u64,
    pub owner: ManagedAddress<SA>,
    pub title: ManagedBuffer<SA>,
    pub description: ManagedBuffer<SA>,
    pub options: ManagedVec<SA, ManagedBuffer<SA>>,
    pub start_timestamp: u64,
    pub end_timestamp: u64,
    pub votes: ManagedVec<SA, u8>,
    pub is_tallied: bool,
    pub is_confidential: bool,
    pub is_sponsored: bool,
}

#[type_abi]
#[derive(Debug, NestedEncode, NestedDecode, TopEncode, TopDecode, Clone, ManagedVecItem)]
pub struct VotingCampaignDetails<SA>
where
    SA: StorageMapperApi,
{
    pub campaign_id: u64,
    pub owner: ManagedAddress<SA>,
    pub title: ManagedBuffer<SA>,
    pub description: ManagedBuffer<SA>,
    pub options: ManagedVec<SA, ManagedBuffer<SA>>,
    pub start_timestamp: u64,
    pub end_timestamp: u64,
    pub votes: ManagedVec<SA, u8>,
    pub eligible_voters: ManagedVec<SA, ManagedAddress<SA>>,
    pub is_tallied: bool,
    pub is_confidential: bool,
    pub is_sponsored: bool,
}

impl<SA> VotingCampaign<SA>
where
    SA: StorageMapperApi,
{
    pub fn set(&mut self, campaign: VotingCampaign<SA>) {
        self.campaign_id = campaign.campaign_id;
        self.owner = campaign.owner;
        self.title = campaign.title;
        self.description = campaign.description;
        self.options  = campaign.options;
        self.votes = campaign.votes;
        self.start_timestamp = campaign.start_timestamp;
        self.end_timestamp = campaign.end_timestamp;
        self.is_tallied = campaign.is_tallied;
        self.is_confidential = campaign.is_confidential;
        self.is_sponsored = campaign.is_sponsored;
    }
}

#[type_abi]
#[derive(Debug, NestedEncode, NestedDecode, TopEncode, TopDecode, Clone, ManagedVecItem)]
pub struct VotingCampaignView<M: ManagedTypeApi> {
    pub campaign_id: u64,
    pub owner: ManagedAddress<M>,
    pub title: ManagedBuffer<M>,
    pub description: ManagedBuffer<M>,
    pub start_timestamp: u64,
    pub end_timestamp: u64,
    pub votes_num: u64,
    pub eligible_voters: ManagedVec<M, ManagedAddress<M>>,
    pub is_tallied: bool,
    pub is_confidential: bool,
    pub is_sponsored: bool,
}

impl<SA> StorageMapper<SA> for VotingCampaign<SA>
where
    SA: StorageMapperApi,
{
    fn new(_: StorageKey<SA>) -> Self {
        VotingCampaign {
            campaign_id: 0,
            owner: ManagedAddress::default(),
            title: ManagedBuffer::default(),
            description: ManagedBuffer::default(),
            options: ManagedVec::new(),
            start_timestamp: 0,
            end_timestamp: 0,
            votes: ManagedVec::new(),
            is_tallied: false,
            is_confidential: false,
            is_sponsored: false,
        }
    }
}

impl<SA> StorageClearable for VotingCampaign<SA>
where
    SA: StorageMapperApi,
{
    fn clear(&mut self) {
        self.campaign_id = 0;
        self.owner = ManagedAddress::default();
        self.title = ManagedBuffer::default();
        self.description = ManagedBuffer::default();
        self.options.clear();
        self.start_timestamp = 0;
        self.end_timestamp = 0;
        self.votes.clear();
        self.is_tallied = false;
        self.is_confidential = false;
        self.is_sponsored = false;
    }
}

#[multiversx_sc::module]
pub trait VotingStorage {
    #[storage_mapper("owner")]
    fn owner(&self) -> SingleValueMapper<ManagedAddress>;

    #[storage_mapper("num_campaigns")]
    fn num_campaigns(&self) -> SingleValueMapper<u64>;

    #[storage_mapper("campaigns")]
    fn campaigns(&self, campaign_id: u64) -> SingleValueMapper<VotingCampaign<Self::Api>>;

    #[storage_mapper("eligible_voters_per_campaign")]
    fn eligible_voters_per_campaign(&self, campaign_id: u64) -> MapMapper<ManagedAddress, bool>;
}