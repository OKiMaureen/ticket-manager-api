import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { Done } from 'mocha';
import Story, { TicketStatus } from '../entity/Story';
import {
  success,
  fail,
  storyCreated,
  storiesList,
  storyAssigned,
  storyNotFound,
  adminNotFound,
  storyApproved,
  storyRejected,
  storyDuplicateApproved,
  storyDuplicateRejected,
} from '../utils/messages';
import User from '../entity/User';

export default class StoryController {
    public createStory = async (req: Request, res: Response) => {
      const storyRepository = getRepository(Story);
      const storyData = req.body;
      const story = new Story();
      story.cost = storyData.cost;
      story.complexity = storyData.complexity;
      story.estimatedFinishTimeInMins = storyData.estimatedFinishTimeInMins;

      // Validade the parameters
      const errors = await validate(story, { validationError: { target: false } });
      if (errors.length > 0) {
        res.status(400).json({
          status: 'Fail',
          data: { error: errors[0].constraints },
        });
        return;
      }

      const userId: number = res.locals.jwtPayload.id;
      let newStory: Story;
      try {
        newStory = await storyRepository.save(
          {
            ...storyData,
            user: userId,
          },
        );
      } catch (error) {
        res.status(400).json({
          status: fail,
          message: 'Only a user can create a story.',
        });
        return;
      }
      res.status(201).json({
        message: storyCreated,
        status: success,
        data: {
          story: { ...newStory },
        },
      });
    }

    public userListAllStories = async (req: Request, res: Response) => {
      const storyRepository = getRepository(Story);
      const userId: number = res.locals.jwtPayload.id;
      const stories = await storyRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });
      res.status(200).json({
        message: storiesList,
        status: success,
        data: {
          stories,
        },
      });
    }

    public adminListAllStories = async (req: Request, res: Response) => {
      const storyRepository = getRepository(Story);
      const stories = await storyRepository.find();
      res.status(200).json({
        message: storiesList,
        status: success,
        data: {
          stories,
        },
      });
    }

    public assignStory = async (req: Request, res: Response) => {
      const userRepository = getRepository(User);
      const storyRepository = getRepository(Story);
      const userId = res.locals.jwtPayload.id;
      const storyId = parseInt(req.params.id, 10);
      let admin: User;
      let story;
      const { adminId } = req.body;
      try {
        story = await storyRepository.findOneOrFail({
          where: {
            id: storyId,
            user: { id: userId },
          },
        });
      } catch (error) {
        res.status(404).json(
          {
            message: storyNotFound,
            status: fail,
          },
        );
        return;
      }
      try {
        admin = await userRepository.findOneOrFail({
          where: {
            id: adminId,
            role: 'admin',
          },
        });
      } catch (error) {
        res.status(404).json(
          {
            message: adminNotFound,
            status: fail,
          },
        );
        return;
      }

      story =await storyRepository.update(storyId, { assignee: {
                id: adminId,
              }, 
      });
      
      const assignedStory = await storyRepository.createQueryBuilder('story')
        .where({ id: storyId })
        .select(['story', 'assignee.id', 'assignee.userName', 'assignee.email'])
        .leftJoin('story.assignee', 'assignee')
        .getOne();
      res.status(200).json({
        message: storyAssigned,
        status: success,
        data: {
          story: assignedStory,
        },
      });
    }

    public approve = async (req: Request, res: Response, done: Done) => {
      const storyRepository = getRepository(Story);
      let story: Story;
      story = res.locals.story;
      if (story.ticketStatus === 'approved') {
        res.status(403).json({
          message: storyDuplicateApproved,
          status: fail,
        });
        return done();
      }
      story = await storyRepository.save({
        ...story,
        ticketStatus: TicketStatus.APPROVED,
      });
      res.status(200).json({
        message: storyApproved,
        status: success,
        data: {
          story,
        },
      });
    }

    public reject = async (req: Request, res: Response, done: Done) => {
      const storyRepository = getRepository(Story);
      let story: Story;
      story = res.locals.story;
      if (story.ticketStatus === 'rejected') {
        res.status(403).json({
          message: storyDuplicateRejected,
          status: fail,
        });
        return done();
      }
      story = await storyRepository.save({
        ...story,
        ticketStatus: TicketStatus.REJECTED,
      });
      res.status(200).json({
        message: storyRejected,
        status: success,
        data: {
          story,
        },
      });
    }
}
