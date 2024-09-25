import { NextRequest, NextResponse } from 'next/server';
import { GET, POST } from './route';
import { connectToDatabase } from '../../../lib/mongodb';

jest.mock('../../../lib/mongodb', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    url,
    method: init?.method || 'GET',
    json: jest.fn().mockImplementation(() => Promise.resolve(init?.body ? JSON.parse(init.body) : {})),
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      status: init?.status || 200,
      json: () => Promise.resolve(body),
    })),
  },
}));

describe('Posts API Route', () => {
  let mockCollection;
  let mockDb;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn(),
      insertOne: jest.fn(),
    };
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (connectToDatabase as jest.Mock).mockResolvedValue(mockDb);
  });

  describe('GET', () => {
    it('should return all posts', async () => {
      const mockPosts = [{ id: '1', title: 'Test Post' }];
      mockCollection.find.mockReturnValue({ toArray: jest.fn().mockResolvedValue(mockPosts) });

      const request = new NextRequest('http://localhost/api/posts');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPosts);
    });

    it('should handle errors', async () => {
      mockCollection.find.mockImplementation(() => {
        throw new Error('Database error');
      });

      const request = new NextRequest('http://localhost/api/posts');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST', () => {
    it('should create a new post with valid data', async () => {
      const validPost = {
        title: 'Test Post',
        content: 'This is a test post',
        type: 'alert',
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      };

      mockCollection.insertOne.mockResolvedValue({ insertedId: 'new-post-id' });

      const request = new NextRequest('http://localhost/api/posts', {
        method: 'POST',
        body: JSON.stringify(validPost),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({ id: 'new-post-id' });
    });

    it('should return validation errors for invalid data', async () => {
      const invalidPost = {
        title: '', // Invalid: empty title
        content: 'This is a test post',
        type: 'invalid-type', // Invalid: not in enum
        location: {
          type: 'Point',
          coordinates: [1000, 1000], // Invalid: out of range
        },
      };

      const request = new NextRequest('http://localhost/api/posts', {
        method: 'POST',
        body: JSON.stringify(invalidPost),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(Array.isArray(data.error)).toBe(true);
      expect(data.error.length).toBeGreaterThan(0);
    });

    it('should handle database errors', async () => {
      const validPost = {
        title: 'Test Post',
        content: 'This is a test post',
        type: 'alert',
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      };

      mockCollection.insertOne.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/posts', {
        method: 'POST',
        body: JSON.stringify(validPost),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
});