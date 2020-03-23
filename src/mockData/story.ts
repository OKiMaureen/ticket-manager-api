import Story, { TicketStatus } from '../entity/Story';

export default class MockStory {
  public static correctStoryDetails(): Story {
    const story = new Story();
    story.summary = 'test summary',
    story.description = 'test description',
    story.type = 'feature type',
    story.complexity = 20,
    story.cost = 2000,
    story.estimatedFinishTimeInMins = 120;
    return story;
  }

  public static correctStoryDetailsTwo(): Story {
    const story = new Story();
    story.summary = 'test summary two',
    story.description = 'test description two',
    story.type = 'feature type two',
    story.complexity = 10,
    story.cost = 2000,
    story.estimatedFinishTimeInMins = 30,
    story.ticketStatus = TicketStatus.REJECTED;
    return story;
  }
}
