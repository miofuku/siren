import { NextRequest, NextResponse } from 'next/server';
import { GET } from './route';
import { GET as GET_SINGLE_POST } from './[id]/route';
import { connectToDatabase } from '../../../lib/mongodb';
import { Collection, Db, ObjectId } from 'mongodb';

jest.mock('../../../lib/mongodb', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('mongodb', () => ({
  ObjectId: jest.fn((id) => ({ toHexString: () => id })),
}));

jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url) => ({
    url,
    method: 'GET',
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      status: init?.status || 200,
      json: () => Promise.resolve(body),
    })),
  },
}));

// Define types for our mocks
type MockCollection = {
  find: jest.Mock;
  findOne: jest.Mock;
};

type MockDb = {
  collection: jest.Mock<MockCollection>;
};

describe('Posts API Route', () => {
  let mockCollection: MockCollection;
  let mockDb: MockDb;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn(),
      findOne: jest.fn(),
    };
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
  });

  describe('GET all posts', () => {
    it('should return all posts', async () => {
      const mockPosts = [{ _id: '1', title: 'Test Post' }];
      mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(mockPosts) });

      const request = new NextRequest('http://localhost/api/posts');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPosts);
    });

    it('should return an empty array when no posts are found', async () => {
      mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) });

      const request = new NextRequest('http://localhost/api/posts');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe('GET single post', () => {
    it('should return a single post', async () => {
      const mockPost = { _id: '1', title: 'Test Post' };
      mockCollection.findOne.mockResolvedValue(mockPost);

      const request = new NextRequest('http://localhost/api/posts/1');
      const params = { id: '1' };
      const response = await GET_SINGLE_POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPost);
    });

    it('should return 404 for non-existent post', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/posts/1');
      const params = { id: '1' };
      const response = await GET_SINGLE_POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Post not found' });
    });
  });
});