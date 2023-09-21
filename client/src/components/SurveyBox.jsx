/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PiDogFill } from 'react-icons/pi'
import { FiFilter } from 'react-icons/fi'

const SurveyBox = ({ api }) => {
    const [surveys, setSurveys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [usernames, setUsernames] = useState({});
    const [currentTag, setCurrentTag] = useState('everyone');
    const [isLoadingUsernames, setIsLoadingUsernames] = useState(true);
    const [userFilledSurveys, setUserFilledSurveys] = useState([]);

    const getTruncatedName = (name, wordLimit) => {
        const words = name.split(' ');
        if (words.length <= wordLimit) {
            return name;
        }
        const truncatedWords = words.slice(0, wordLimit);
        return truncatedWords.join(' ') + ' ...';
    };

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await api.get('/surveys');
                setSurveys(response.data);
                setIsLoading(false);
            } catch(error) {
                console.error('Error fetching surveys: ', error);
                setIsLoading(false);
            }
        }

        fetchSurveys();
    }, [api, setSurveys]);

    useEffect(() => {
        const getUserNameById = async (userId) => {
            try {
                const response = await api.get(`/users/user/userId/${userId}`);
                setIsLoadingUsernames(false);
                return response.data.userName;
            } catch (error) {
                console.error('Error fetching username by Id: ', error);
                setIsLoadingUsernames(false);
                return null;
            }
        };

        const fetchUsernames = async () => {
            try {
                const userIds = surveys.map((survey) => survey.surveyCreator);
                const uniqueUserIds = [...new Set(userIds)];
                const usernames = {};
        
                for (const userId of uniqueUserIds) {
                    const username = await getUserNameById(userId);
                    usernames[userId] = username;
                }
    
                setUsernames(usernames);
            } catch (error) {
                console.error('Error fetching usernames: ', error);
            }
        };

        fetchUsernames();
    }, [api, setUsernames, surveys]);

    useEffect(() => {
        const fetchUserFilledSurveys = async () => {
            try {
                const response = await api.get('/users/user/filled-surveys');
                setUserFilledSurveys(response.data.filledSurveys);
            } catch (error) {
                console.error('Error fetching user filled surveys: ', error);
            }
        };

        fetchUserFilledSurveys();
    }, [api]);

    const filteredSurveys =
    currentTag === 'everyone'
        ? surveys
        : surveys.filter((survey) => survey.surveyTag === currentTag);

    const handleTagFilter = (tag) => {
        setCurrentTag(tag);
    };

    const handleFilterByReward = (filter) => {
        let filteredData = [...filteredSurveys];
    
        if (filter === 'low') {
            filteredData.sort((a, b) => a.balanceReward - b.balanceReward);
        } else if (filter === 'high') {
            filteredData.sort((a, b) => b.balanceReward - a.balanceReward);
        }
    
        setSurveys(filteredData);
    };

    const handleFilterByDate = (filter) => {
        let filteredData = [...filteredSurveys];
    
        if (filter === 'oldest') {
            filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (filter === 'newest') {
            filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    
        setSurveys(filteredData);
    };

    return (
        <div className="flex shrink justify-center items-center w-full my-4">
            <div className="flex flex-col items-center justify-center hero-box shrink p-4 w-[75%] mx-10 rounded-xl gap-4">
                <div className="flex md:flex-row flex-col justify-between items-center bg-stone-300 py-2 px-10 rounded-lg w-[100%] gap-2">
                    <div className="dropdown dropdown-hover rounded flex justify-center items-center">
                        <label tabIndex={0} className="btn bg-black text-white font-bold px-10 hover:text-black hover:border-black flex justify-center items-center">
                            Filter
                            <FiFilter />
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <button className="btn btn-ghost btn-sm" onClick={() => handleFilterByReward('low')}>
                                    Low Reward
                                </button>
                            </li>
                            <li>
                                <button className="btn btn-ghost btn-sm" onClick={() => handleFilterByReward('high')}>
                                    High Reward
                                </button>
                            </li>
                            <li>
                                <button className="btn btn-ghost btn-sm" onClick={() => handleFilterByDate('oldest')}>
                                    Oldest First
                                </button>
                            </li>
                            <li>
                                <button className="btn btn-ghost btn-sm" onClick={() => handleFilterByDate('newest')}>
                                    Newest First
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className='flex lg:flex-row flex-col justify-between items-center w-[80%] gap-1'>
                        {['everyone' ,'education', 'medical', 'business'].map((tag) => (
                        <button
                            key={tag}
                            className={`btn rounded-xl w-48 shrink text-center font-bold ${
                            currentTag === tag ? 'bg-stone-700 text-white' : ''
                            }`}
                            onClick={() => handleTagFilter(tag)}
                        >
                            {tag}
                        </button>
                        ))}
                    </div>
                </div>

                {
                    filteredSurveys.length === 0 ? (
                        <div className='w-full h-48 flex justify-center items-center'>
                            <span className='text-2xl font-semibold text-stone-500 flex items-center justify-center gap-2'>
                                <PiDogFill className='text-5xl' /> Wow. such empty
                            </span>
                        </div>
                    ) : (
                        isLoading ? (
                            <span className="loading loading-spinner loading-lg"></span>
                        ) : (
                            filteredSurveys.map((survey, index) => (
                                <div className='bg-stone-500 w-full hero-box rounded-xl' key={index}>
                                    <div className='flex justify-between items-center md:flex-row flex-col gap-2 px-5 py-3'>
                                        <div className='flex gap-6 justify-center items-center'>
                                            <h1 className='font-bold text-3xl'>
                                                {(index + 1).toString().padStart(2, '0')}
                                            </h1>
                                            <div>
                                                <h1 className='font-bold text-xl'>{getTruncatedName(survey.surveyName, 5)}</h1>
                                                {isLoadingUsernames ? (
                                                    <span className="loading loading-spinner loading-lg"></span>
                                                    ) : (
                                                    <p className="font-light">
                                                        {usernames[survey.surveyCreator] || 'Unknown User'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex flex-col justify-center items-center gap-1'>
                                            <h1 className='text-xl text-green-600'>
                                                {userFilledSurveys.includes(survey._id) ? "Completed" : `${survey.balanceReward} Points`}
                                            </h1>
                                            <Link to={`/survey/${survey._id}`}>
                                                <button className="btn bg-black w-56 text-white hover:text-black hover:border-black">
                                                    {userFilledSurveys.includes(survey._id) ? "View Filled Survey" : "Take Survey"}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )
                }
                
            </div>
        </div>
    )
}

export default SurveyBox

{/* <button className='btn bg-white rounded-xl w-48 shrink text-center font-bold'>#Everyone</button>
                        <button className='btn bg-white rounded-xl w-48 shrink text-center font-bold'>#Education</button>
                        <button className='btn bg-white rounded-xl w-48 shrink text-center font-bold'>#Medical</button>
                        <button className='btn bg-white rounded-xl w-48 shrink text-center font-bold'>#Business</button> */}