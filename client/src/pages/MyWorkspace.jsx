/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdArrowBackIosNew } from 'react-icons/md'
import { BsFillTrashFill, BsArrowUp, BsArrowDown } from 'react-icons/bs'
import { PiDogFill } from 'react-icons/pi'
import { FiFilter } from 'react-icons/fi'
import SuccessToast from '../components/SuccessToast'

const MyWorkspace = ({ api }) => {
  const navigate = useNavigate();
  const [ownerSurveys, setOwnerSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchOwnerSurveys = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/owner-surveys');
        setOwnerSurveys(response.data);
      } catch (error) {
        console.error('Error fetching owner surveys: ', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOwnerSurveys();
  }, [api]);

  const sortedSurveys = [...ownerSurveys].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'reward') {
      return sortOrder === 'asc' ? a.totalReward - b.totalReward : b.totalReward - a.totalReward;
    } else {
      return 0;
    }
  });

  const handleSortBy = (sortType) => {
    setSortBy(sortType);
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const getTruncatedName = (name, wordLimit) => {
    const words = name.split(' ');
    if (words.length <= wordLimit) {
      return name;
    }
    const truncatedWords = words.slice(0, wordLimit);
    return truncatedWords.join(' ') + ' ...';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-UK', options);
  };

  const handleDeleteSurvey = async (surveyId) => {
    try {
      setIsLoading(true);
      const response = await api.delete('/survey', { data: { surveyId } });

      console.log(response.data.message);

      setOwnerSurveys((prevSurveys) =>
        prevSurveys.filter((survey) => survey._id !== surveyId)
      );

      setSuccessMessage('Survey Deleted successfully.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 1000);
    } catch (error) {
      console.error('Error deleting survey: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full flex flex-col justify-center items-center m-4'>
      {successMessage && <SuccessToast message={successMessage} />}
      <div className='w-[75%] flex justify-between items-center py-1'>
        <Link to="/" className='p-2 hero-box rounded-lg cursor-pointer'>
          <MdArrowBackIosNew className='w-6 h-6' />
        </Link>
        <h1 className='text-3xl font-bold'>My Workspace</h1>
        <div></div>
      </div>

      <div className='w-[75%] hero-box flex flex-col justify-center items-center mt-4 rounded-2xl'>
        <div className='w-[95%] flex md:flex-row flex-col justify-between items-center bg-stone-200 rounded-xl m-2 py-3 px-8'>
          <button className='btn py-3 px-8 flex justify-center items-center bg-black text-white rounded-xl gap-2 hover:text-black hover:bg-white' onClick={() => navigate('/questionpage')}>
            <AiOutlinePlus className='w-5 h-5' />
            Create Survey
          </button>
          <div className="dropdown dropdown-hover rounded">
              <label tabIndex={0} className="btn bg-black text-white font-bold px-10 hover:text-black hover:border-black flex justify-center items-center rounded-xl">
                Filter
                <FiFilter />
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button className='btn btn-ghost btn-sm' onClick={() => handleSortBy('date')}>
                      Date
                      {sortBy === 'date' && sortOrder === 'asc' ? <BsArrowUp /> : <BsArrowDown />}
                    </button>
                  </li>
                  <li>
                    <button className='btn btn-ghost btn-sm' onClick={() => handleSortBy('reward')}>
                      Rewards
                      {sortBy === 'reward' && sortOrder === 'asc' ? <BsArrowUp /> : <BsArrowDown />}
                    </button>
                  </li>
              </ul>
          </div>
        </div>

        <div className='w-[95%] flex justify-center items-center flex-col pb-4'>
          <div className='w-full flex justify-between items-center gap-2 text-center mt-4 mb-2 px-2'>
            <p className='w-16 flex-initial'>No.</p>
            <p className='flex-1'>Surveys</p>
            <p className='w-24 flex-initial'>Questions</p>
            <p className='w-24 flex-initial'>Tokens</p>
            <p className='w-48 flex-initial'>Date</p>
            <p className='w-60 flex-initial'>Delete</p>
          </div>

          <div className='border-b-2 bg-black w-full px-2' />

          <div className='w-full flex justify-center items-center flex-col'>

            {sortedSurveys.length === 0 ? (
              <div className='w-full h-48 flex justify-center items-center'>
                <span className='text-2xl font-semibold text-stone-500 flex items-center justify-center gap-2'>
                  <PiDogFill className='text-5xl' /> Wow. such empty
                </span>
              </div>
            ) : isLoading ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              sortedSurveys.map((survey, index) => (
                <div className='w-full hero-box flex justify-center gap-2 items-center text-center p-2 rounded-xl mt-4' key={index}>
                  <h3 className='w-16 flex-initial font-semibold text-xl'>{(index + 1).toString().padStart(2, '0')}</h3>
                  <h1 className='flex-1 font-bold text-xl'>{getTruncatedName(survey.surveyName, 2)}</h1>
                  <h3 className='w-24 flex-initial font-bold text-xl'>{survey.questions.length}</h3>
                  <h3 className='w-24 flex-initial font-bold text-xl'>{survey.totalReward}</h3>
                  <h3 className='w-48 flex-initial font-semibold text-lg'>{formatDate(survey.createdAt)}</h3>
                  <div className='w-60 flex-initial flex justify-center items-center'>
                    <button className="btn w-[80%] bg-red-300 text-red-700 border-red-700 flex justify-center items-center" onClick={() => handleDeleteSurvey(survey._id)}>
                      {isLoading ? <span className="loading loading-spinner loading-lg"></span> : (
                        <>
                          <BsFillTrashFill /> <span>Delete</span>
                        </>
                      ) }
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>
          
        </div>

      </div>
    </div>
  )
}

export default MyWorkspace


// {isLoading ? <span className="loading loading-spinner loading-lg"></span> :
//               ownerSurveys.map((survey, index) => (
//                 <div className='w-full hero-box flex justify-center gap-2 items-center text-center p-2 rounded-xl mb-4' key={index}>
//                   <h3 className='w-16 flex-initial font-semibold text-xl'>{(index + 1).toString().padStart(2, '0')}</h3>
//                   <h1 className='flex-1 font-bold text-xl'>{getTruncatedName(survey.surveyName, 2)}</h1>
//                   <h3 className='w-24 flex-initial font-bold text-xl'>{survey.questions.length}</h3>
//                   <h3 className='w-24 flex-initial font-bold text-xl'>{survey.totalReward}</h3>
//                   <h3 className='w-48 flex-initial font-semibold text-lg'>{formatDate(survey.createdAt)}</h3>
//                   <div className='w-60 flex-initial flex justify-center items-center'>
//                     <button className="btn w-[80%] bg-red-300 text-red-700 border-red-700 flex justify-center items-center" onClick={() => handleDeleteSurvey(survey._id)}>
//                       {isLoading ? <span className="loading loading-spinner loading-lg"></span> : (
//                         <>
//                           <BsFillTrashFill /> <span>Delete</span>
//                         </>
//                       ) }
//                     </button>
//                   </div>
//                 </div>
//               ))
//             }