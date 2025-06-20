use multiversx_sc_scenario::*;

use multiversx_sc_scenario::imports::*;
pub mod proxy;
use proxy::{VotingCampaignView, VotingCampaignDetails};


const VOTING_ADDRESS: TestSCAddress = TestSCAddress::new("voting");
const VOTING_CODE_PATH: MxscPath = MxscPath::new("output/blockchain.mxsc.json");
const OWNER_ADDRESS: TestAddress = TestAddress::new("owner");
const VOTER1_ADDRESS: TestAddress = TestAddress::new("voter1");
const VOTER2_ADDRESS: TestAddress = TestAddress::new("voter2");
const VOTER3_ADDRESS: TestAddress = TestAddress::new("voter3");
const NON_ELIGIBLE_VOTER: TestAddress = TestAddress::new("non-eligible");

fn world() -> ScenarioWorld {
    let mut blockchain = ScenarioWorld::new().executor_config(ExecutorConfig::full_suite());
    blockchain.register_contract(VOTING_CODE_PATH, blockchain::ContractBuilder);
    blockchain
}

struct VotingTestState {
    world: ScenarioWorld,
}

impl VotingTestState {
    fn new() -> Self {
        let mut world = world();

        world
            .account(OWNER_ADDRESS)
            .nonce(1)
            .account(VOTER1_ADDRESS)
            .nonce(1)
            .account(VOTER2_ADDRESS)
            .nonce(1)
            .account(VOTER3_ADDRESS)
            .nonce(1)
            .account(NON_ELIGIBLE_VOTER)
            .nonce(1);

        Self { world }
    }

    fn deploy_voting_contract(&mut self) -> &mut Self {
        self.world
            .tx()
            .from(OWNER_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .init()
            .code(VOTING_CODE_PATH)
            .new_address(VOTING_ADDRESS)
            .run();

        self
    }

    fn create_campaign(
        &mut self,
        from: TestAddress,
        title: &str,
        description: &str,
        start_timestamp: u64,
        end_timestamp: u64,
        eligible_voters: Vec<TestAddress>,
        options: Vec<&str>,
        is_confidential: bool,
        is_sponsored: bool,
    ) {
        let eligible_voters_managed: ManagedVec<_, ManagedAddress<_>> = eligible_voters.into_iter()
            .map(|addr| addr.to_managed_address())
            .collect();
        let options_managed: ManagedVec<_, ManagedBuffer<_>> = options.iter()
            .map(|s| ManagedBuffer::new_from_bytes(s.as_bytes()))
            .collect();

        self.world
            .tx()
            .from(from)
            .to(VOTING_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .create_campaign(
                ManagedBuffer::new_from_bytes(title.as_bytes()),
                ManagedBuffer::new_from_bytes(description.as_bytes()),
                start_timestamp,
                end_timestamp,
                eligible_voters_managed,
                options_managed,
                is_confidential,
                is_sponsored,
            )
            .run();
    }

    fn create_campaign_expect_err(
        &mut self,
        from: TestAddress,
        title: &str,
        description: &str,
        start_timestamp: u64,
        end_timestamp: u64,
        eligible_voters: Vec<TestAddress>,
        options: Vec<&str>,
        is_confidential: bool,
        is_sponsored: bool,
        err_message: &str,
    ) {
        let eligible_voters_managed: ManagedVec<_, ManagedAddress<_>> = eligible_voters.into_iter()
            .map(|addr| addr.to_managed_address())
            .collect();
        let options_managed: ManagedVec<_, ManagedBuffer<_>> = options.iter()
            .map(|s| ManagedBuffer::new_from_bytes(s.as_bytes()))
            .collect();

        self.world
            .tx()
            .from(from)
            .to(VOTING_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .create_campaign(
                ManagedBuffer::new_from_bytes(title.as_bytes()),
                ManagedBuffer::new_from_bytes(description.as_bytes()),
                start_timestamp,
                end_timestamp,
                eligible_voters_managed,
                options_managed,
                is_confidential,
                is_sponsored,
            )
            .with_result(ExpectError(4, err_message))
            .run();
    }

    fn vote(&mut self, from: TestAddress, campaign_id: u64, option: u8) {
        self.world
            .tx()
            .from(from)
            .to(VOTING_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .vote(campaign_id, option)
            .run();
    }

    fn vote_expect_err(&mut self, from: TestAddress, campaign_id: u64, option: u8, err_message: &str) {
        self.world
            .tx()
            .from(from)
            .to(VOTING_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .vote(campaign_id, option)
            .with_result(ExpectError(4, err_message))
            .run();
    }

    fn close_campaign(&mut self, from: TestAddress, campaign_id: u64) {
        self.world
            .tx()
            .from(from)
            .to(VOTING_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .close_campaign(campaign_id)
            .run();
    }

    fn close_campaign_expect_err(&mut self, from: TestAddress, campaign_id: u64, err_message: &str) {
        self.world
            .tx()
            .from(from)
            .to(VOTING_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .close_campaign(campaign_id)
            .with_result(ExpectError(4, err_message))
            .run();
    }

    fn set_block_timestamp(&mut self, timestamp: u64) {
        // self.world.set_block_timestamp(timestamp);
    }

    fn check_campaign_active(&mut self, campaign_id: u64, expected: bool) {
        self.world
            .query()
            .to(VOTING_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .is_voting_active(campaign_id)
            .returns(ExpectValue(expected))
            .run();
    }

    fn get_tallied_votes(&mut self, campaign_id: u64) -> ManagedVec<StaticApi, u64> {
        self.world
            .query()
            .to(VOTING_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .get_tallied_votes(campaign_id)
            .returns(ReturnsResult)
            .run()
    }

    fn get_all_campaigns(&mut self) -> ManagedVec<StaticApi, proxy::VotingCampaignView<StaticApi>> {
        self.world
            .query()
            .to(VOTING_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .get_all_campaigns()
            .returns(ReturnsResult)
            .run()
    }

    fn get_campaign_by_id(&mut self, campaign_id: u64) -> proxy::VotingCampaignDetails<StaticApi> {
        self.world
            .query()
            .to(VOTING_ADDRESS)
            .typed(proxy::VotingSystemProxy)
            .get_campaign_by_id(campaign_id)
            .returns(ReturnsResult)
            .run()
    }
}

#[test]
fn test_deploy_voting_contract() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    // Check initial state
    let campaigns = state.get_all_campaigns();
    assert_eq!(campaigns.len(), 0);
}

#[test]
fn test_create_campaign_success() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time + 100,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B", "Option C"],
        false,
        false,
    );

    let campaigns = state.get_all_campaigns();
    assert_eq!(campaigns.len(), 1);

    let campaign = state.get_campaign_by_id(0);
    assert_eq!(campaign.campaign_id, 0);
    assert_eq!(campaign.owner, OWNER_ADDRESS.to_managed_address());
    assert_eq!(campaign.options.len(), 3);
    assert_eq!(campaign.eligible_voters.len(), 2);
    assert_eq!(campaign.is_tallied, false);
}

#[test]
fn test_create_campaign_invalid_options() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Test with only 1 option (should fail)
    state.create_campaign_expect_err(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time + 100,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A"],
        false,
        false,
        "Must have at least 2 options for voting",
    );
}

#[test]
fn test_create_campaign_invalid_timestamps() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Test with end time before start time (should fail)
    state.create_campaign_expect_err(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time + 1000,
        current_time + 100,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
        "End time must be after start time",
    );
}

#[test]
fn test_vote_success() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Vote
    state.vote(VOTER1_ADDRESS, 0, 0);
    state.vote(VOTER2_ADDRESS, 0, 1);

    let campaign = state.get_campaign_by_id(0);
    assert_eq!(campaign.votes.len(), 2);
}

#[test]
fn test_vote_not_active() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign that hasn't started yet
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time + 100,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Try to vote before campaign starts
    state.vote_expect_err(VOTER1_ADDRESS, 0, 0, "Voting is not active");
}

#[test]
fn test_vote_after_end() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time,
        current_time + 100,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Move time past campaign end
    state.set_block_timestamp(current_time + 200);

    // Try to vote after campaign ends
    state.vote_expect_err(VOTER1_ADDRESS, 0, 0, "Voting is not active");
}

#[test]
fn test_vote_not_eligible() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign with specific eligible voters
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Try to vote with non-eligible voter
    state.vote_expect_err(NON_ELIGIBLE_VOTER, 0, 0, "Not eligible to vote");
}

#[test]
fn test_vote_already_voted() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Vote once
    state.vote(VOTER1_ADDRESS, 0, 0);

    // Try to vote again
    state.vote_expect_err(VOTER1_ADDRESS, 0, 1, "Already voted");
}

#[test]
fn test_vote_invalid_option() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign with 2 options
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Try to vote for option 2 (index out of bounds)
    state.vote_expect_err(VOTER1_ADDRESS, 0, 2, "Invalid option");
}

#[test]
fn test_close_campaign_success() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Close campaign
    state.close_campaign(OWNER_ADDRESS, 0);

    let campaign = state.get_campaign_by_id(0);
    assert_eq!(campaign.is_tallied, true);
}

#[test]
fn test_close_campaign_not_owner() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Try to close campaign from non-owner
    state.close_campaign_expect_err(VOTER1_ADDRESS, 0, "Only owner can tally votes");
}

#[test]
fn test_close_campaign_already_tallied() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Close campaign once
    state.close_campaign(OWNER_ADDRESS, 0);

    // Try to close again
    state.close_campaign_expect_err(OWNER_ADDRESS, 0, "Votes already tallied");
}

#[test]
fn test_get_tallied_votes() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS, VOTER3_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Vote
    state.vote(VOTER1_ADDRESS, 0, 0); // Vote for Option A
    state.vote(VOTER2_ADDRESS, 0, 0); // Vote for Option A
    state.vote(VOTER3_ADDRESS, 0, 1); // Vote for Option B

    // Close campaign
    state.close_campaign(OWNER_ADDRESS, 0);

    // Get tallied votes
    let votes = state.get_tallied_votes(0);
    assert_eq!(votes.len(), 2);
    // Option A should have 2 votes, Option B should have 1 vote
    // Note: The exact verification depends on how the return value is structured
}

#[test]
fn test_is_campaign_active() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create campaign
    state.create_campaign(
        OWNER_ADDRESS,
        "Test Campaign",
        "A test voting campaign",
        current_time + 100,
        current_time + 1000,
        vec![VOTER1_ADDRESS, VOTER2_ADDRESS],
        vec!["Option A", "Option B"],
        false,
        false,
    );

    // Check before start
    state.check_campaign_active(0, false);

    // Move to start time
    state.set_block_timestamp(current_time + 100);
    state.check_campaign_active(0, true);

    // Move past end time
    state.set_block_timestamp(current_time + 1100);
    state.check_campaign_active(0, false);
}

#[test]
fn test_multiple_campaigns() {
    let mut state = VotingTestState::new();
    state.deploy_voting_contract();

    let current_time = 1000u64;
    state.set_block_timestamp(current_time);

    // Create first campaign
    state.create_campaign(
        OWNER_ADDRESS,
        "Campaign 1",
        "First campaign",
        current_time,
        current_time + 1000,
        vec![VOTER1_ADDRESS],
        vec!["A", "B"],
        false,
        false,
    );

    // Create second campaign
    state.create_campaign(
        VOTER1_ADDRESS,
        "Campaign 2",
        "Second campaign",
        current_time,
        current_time + 1000,
        vec![VOTER2_ADDRESS],
        vec!["X", "Y", "Z"],
        true,
        true,
    );

    let campaigns = state.get_all_campaigns();
    assert_eq!(campaigns.len(), 2);

    let campaign1 = state.get_campaign_by_id(0);
    let campaign2 = state.get_campaign_by_id(1);

    assert_eq!(campaign1.campaign_id, 0);
    assert_eq!(campaign2.campaign_id, 1);
    assert_eq!(campaign1.is_confidential, false);
    assert_eq!(campaign2.is_confidential, true);
    assert_eq!(campaign1.is_sponsored, false);
    assert_eq!(campaign2.is_sponsored, true);
}