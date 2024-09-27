import Link from 'next/link';

interface Location {
  type: string;
  coordinates: [number, number];
  placeName: string;
}

interface Resource {
  title: string;
  url: string;
}

interface PostProps {
  _id: string;
  title: string;
  content: string;
  type: 'missing_person' | 'hazard_warning' | 'crime_warning' | 'other';
  locations: Location[];
  createdAt: string;
  resources?: Resource[];  // Make resources optional
  missingPersonDetails?: {
    name: string;
    age: number;
    lastSeen: string;
  };
  hazardDetails?: {
    hazardType: string;
    severity: 'low' | 'medium' | 'high';
  };
  crimeDetails?: {
    crimeType: string;
    suspectDescription?: string;
  };
}

const Post: React.FC<PostProps> = ({ 
  _id, 
  title, 
  content, 
  type, 
  locations, 
  createdAt, 
  resources = [],  // Provide a default empty array
  missingPersonDetails,
  hazardDetails,
  crimeDetails
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <Link href={`/posts/${_id}`} className="text-xl font-bold mb-2 text-blue-600 hover:underline">
        {title}
      </Link>
      <p className="text-gray-600 mb-2">{content.substring(0, 150)}...</p>
      <div className="text-sm text-gray-500 mb-2">
        <span className="mr-2">Type: {type}</span>
        <span className="mr-2">Location: {locations[0]?.placeName || 'Unknown'}</span>
        <span>Posted on: {new Date(createdAt).toLocaleDateString()}</span>
      </div>
      
      {/* Render specific details based on post type */}
      {type === 'missing_person' && missingPersonDetails && (
        <div className="mt-2">
          <p>Name: {missingPersonDetails.name}</p>
          <p>Age: {missingPersonDetails.age}</p>
          <p>Last Seen: {missingPersonDetails.lastSeen}</p>
        </div>
      )}
      
      {type === 'hazard_warning' && hazardDetails && (
        <div className="mt-2">
          <p>Hazard Type: {hazardDetails.hazardType}</p>
          <p>Severity: {hazardDetails.severity}</p>
        </div>
      )}
      
      {type === 'crime_warning' && crimeDetails && (
        <div className="mt-2">
          <p>Crime Type: {crimeDetails.crimeType}</p>
          {crimeDetails.suspectDescription && (
            <p>Suspect Description: {crimeDetails.suspectDescription}</p>
          )}
        </div>
      )}
      
      {resources.length > 0 && (
        <div className="mt-2">
          <h4 className="font-semibold">Resources:</h4>
          <ul>
            {resources.map((resource, index) => (
              <li key={index}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Post;