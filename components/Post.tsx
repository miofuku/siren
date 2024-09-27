import Link from 'next/link';

interface Location {
  type: string;
  coordinates: [number, number];
  placeName: string;
}

interface PostProps {
  _id: string;
  title: string;
  content: string;
  type: string;
  locations: Location[];
  createdAt: string;
}

const Post: React.FC<PostProps> = ({ _id, title, content, type, locations, createdAt }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <Link href={`/posts/${_id}`} className="text-xl font-bold mb-2 text-blue-600 hover:underline">
        {title}
      </Link>
      <p className="text-gray-600 mb-2">{content.substring(0, 150)}...</p>
      <div className="text-sm text-gray-500">
        <span className="mr-2">Type: {type}</span>
        <span className="mr-2">Location: {locations[0]?.placeName || 'Unknown'}</span>
        <span>Posted on: {new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default Post;