import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState('');
  const [editingFileObj, setEditingFileObj] = useState<File | null>(null);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const token = localStorage.getItem('token');
  const [memoryConsumed, setMemoryConsumed] = useState<number>(0);

  const fetchFiles = async () => {
    try {
      const { data } = await axios.get(
        'https://datahub-backend-1d73729e6f15.herokuapp.com/api/files',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setFiles(data);
    } catch (error) {
      setError('Error fetching files');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchMemoryConsumed = async () => {
    try {
      // Include authentication credentials in the request
      const response = await axios.get(
        'https://datahub-backend-1d73729e6f15.herokuapp.com/api/files/bucket-size',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      setMemoryConsumed(response.data.sizeGB * 1024);
    } catch (error) {
      console.error('Error fetching memory consumed:', error);
    }
  };

  useEffect(() => {
    fetchMemoryConsumed();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setEditingFileObj(selectedFile || null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('name', fileName);

    try {
      await axios.post(
        'https://datahub-backend-1d73729e6f15.herokuapp.com/api/files',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchFiles();
      fetchMemoryConsumed();
      setFileName('');
      setFile(null);
      setSuccess('File uploaded successfully');
      setError('');
      setShowUploadPopup(false);
    } catch (error) {
      setError('Error uploading file');
      setSuccess('');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting file with ID:', id);
      await axios.delete(
        `https://datahub-backend-1d73729e6f15.herokuapp.com/api/files/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchFiles();
      fetchMemoryConsumed();
      setSuccess('File deleted successfully');
      setError('');
    } catch (error) {
      setError('Error deleting file');
      console.error('Error deleting file:', error);
    }
  };

  const handleEdit = (id: string, fileName: string) => {
    setEditingFile(id);
    setEditingFileName(fileName);
    setShowEditPopup(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editingFileName);

    if (editingFileObj) {
      formData.append('file', editingFileObj);
    }

    try {
      await axios.put(
        `https://datahub-backend-1d73729e6f15.herokuapp.com/api/files/${editingFile}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setEditingFile(null);
      setEditingFileName('');
      setEditingFileObj(null);
      fetchFiles();
      fetchMemoryConsumed();
      setSuccess('File updated successfully');
      setError('');
      setShowEditPopup(false);
    } catch (error) {
      setError('Error updating file');
      setSuccess('');
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Files" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  File Listing
                </h3>
              </div>
              <div className="p-7">
                {files.length > 0 ? (
                  <div className="max-w-full overflow-x-auto table-wrapper">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                          <th className="py-4 px-4 font-medium text-black dark:text-white">
                            File Name
                          </th>
                          <th className="py-4 px-4 font-medium text-black dark:text-white">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {files.map(
                          (file: { _id: string; name: string }, idx) => (
                            <tr key={idx} className="content-center">
                              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                {file.name}
                              </td>
                              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <span className="actions flex grid-cols-2 gap-4">
                                  <BsFillTrashFill
                                    className="delete-btn cursor-pointer"
                                    onClick={() => handleDelete(file._id)}
                                  />
                                  <BsFillPencilFill
                                    className="edit-btn cursor-pointer"
                                    onClick={() =>
                                      handleEdit(file._id, file.name)
                                    }
                                  />
                                </span>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No files uploaded</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  {showEditPopup ? 'Edit File' : 'Upload File'}
                </h3>
              </div>
              <div className="p-7">
                <form
                  onSubmit={showEditPopup ? handleEditSubmit : handleSubmit}
                >
                  {showEditPopup ? (
                    <>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="w-full">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus focus-visible dark dark dark dark:focus"
                            type="text"
                            name="editFileName"
                            id="editFileName"
                            placeholder="Enter file name"
                            value={editingFileName}
                            onChange={(e) => setEditingFileName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                        <input
                          type="file"
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          onChange={handleEditFileChange}
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                fill="#3C50E0"
                              />
                            </svg>
                          </span>
                          <p></p>
                          <p>
                            <span className="text-primary">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="mt-1.5">any file type</p>
                          <p></p>
                        </div>
                      </div>
                      {editingFileObj && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Uploaded File:</h4>
                          <p className="text-gray-600">{editingFileObj.name}</p>
                        </div>
                      )}
                      <div className="flex justify-end gap-4.5">
                        <button
                          className="flex justify-center rounded border border-stroke py-2 px-4 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                          type="button"
                          onClick={() => setShowEditPopup(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="flex justify-center rounded bg-primary py-2 px-4 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
                        >
                          Update
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Upload File Form */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="w-full">
                          <input
                            className="w-full md rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus focus-visible dark dark dark dark:focus"
                            type="text"
                            name="fileName"
                            id="fileName"
                            placeholder="Enter file name"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                        <input
                          type="file"
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer
                          p-0 opacity-0 outline-none"
                          onChange={handleFileChange}
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                fill="#3C50E0"
                              />
                            </svg>
                          </span>
                          <p></p>
                          <p>
                            <span className="text-primary">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="mt-1.5">any file type</p>
                        </div>
                      </div>
                      {file && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Uploaded File:</h4>
                          <p className="text-gray-600">{file.name}</p>
                        </div>
                      )}
                      <br></br>
                      <div className="flex justify-end gap-4.5">
                        <button
                          className="flex justify-center rounded border border-stroke py-2 px-4 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                          type="button"
                          onClick={() => setShowUploadPopup(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="flex justify-center rounded bg-primary py-2 px-4 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
                        >
                          Upload
                        </button>
                      </div>
                    </>
                  )}
                  <div className="mt-2">
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Files;
