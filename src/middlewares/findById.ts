import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Story from '../entity/Story';
import { fail, storyNotFound } from '../utils/messages';

const findStoryById = async (req: Request, res: Response, next: NextFunction) => {
  const storyId = parseInt(req.params.id, 10);
  const storyRepository = getRepository(Story);
  let story: Story;
  try {
    story = await storyRepository.findOneOrFail({
      where: { id: storyId },
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
  res.locals.story = story;
  next();
};

export default findStoryById;
