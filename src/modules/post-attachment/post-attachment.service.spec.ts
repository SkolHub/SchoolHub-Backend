import { Test, TestingModule } from '@nestjs/testing';
import { PostAttachmentService } from './post-attachment.service';

describe('PostAttachmentService', () => {
  let service: PostAttachmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostAttachmentService],
    }).compile();

    service = module.get<PostAttachmentService>(PostAttachmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
