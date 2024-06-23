import { useEffect, useState } from 'react';
import axios from 'axios';

interface File {
  _id: string;
  name: string;
  createdAt: string;
  url: string;
}

const TableOne = () => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          'https://datahub-backend-1d73729e6f15.herokuapp.com/api/files/latest',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`, // assuming token is stored in local storage
            },
          },
        );
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  // Function to extract the file extension from the URL
  const getFileType = (url: string) => {
    return url.split('.').pop()?.split('?')[0] || 'unknown';
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Latest Files
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5 text-left">
            <h5 className="text-sm font-medium xsm:text-base">File Name</h5>
          </div>
          <div className="p-2.5 xl:p-5 text-left">
            <h5 className="text-sm font-medium xsm:text-base">Uploaded At</h5>
          </div>
          <div className="p-2.5 xl:p-5 text-left">
            <h5 className="text-sm font-medium xsm:text-base">File Type</h5>
          </div>
        </div>

        {files.map((file, key) => (
          <div
            className={`grid grid-cols-3 ${
              key === files.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={file._id}
          >
            <div className="flex items-left p-2.5 xl:p-5">
              <p className="text-black dark:text-white text-left">
                {file.name}
              </p>
            </div>

            <div className="flex items-left p-2.5 xl:p-5">
              <p className="text-black dark:text-white text-left">
                {new Date(file.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-left p-2.5 xl:p-5">
              <p className="text-black dark:text-white text-left">
                {getFileType(file.url)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
