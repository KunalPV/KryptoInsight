/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import SuccessToast from '../components/SuccessToast';
import ErrorToast from '../components/ErrorToast';

const SurveyPage = ({ api }) => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [usernameFetched, setUsernameFetched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formValues, setFormValues] = useState([]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await api.get(`/survey/${id}`);
        setIsLoading(false);
        setSelectedSurvey(response.data);
        setFormValues([]);
      } catch (error) {
        console.error('Error fetching survey questions: ', error);
        setIsLoading(false);
      }
    }

    fetchSurvey();
  }, [api, id]);

  useEffect(() => {
    if (selectedSurvey && !usernameFetched) {
      fetchUsername(selectedSurvey.surveyCreator);
    }
  }, [selectedSurvey, usernameFetched]);

  const fetchUsername = async (userId) => {
    try {
      setUserLoading(true);
      const response = await api.get(`/users/user/userId/${userId}`);
      setSelectedSurvey((prevSurvey) => ({
        ...prevSurvey,
        surveyCreatorUsername: response.data.userName,
      }));
      setUserLoading(false);
      setUsernameFetched(true);
    } catch (error) {
      console.error('Error fetching username: ', error);
      setUserLoading(false);
    }
  };

  const handleChange = (event, index) => {
    const { name, value, type } = event.target;
    if (type === 'radio') {
      setFormValues((prevValues) => {
        const updatedValues = [...prevValues];
        const selectedOption = {};
        selectedOption[name] = value;
        updatedValues[index] = { ...updatedValues[index], ...selectedOption };
        return updatedValues;
      });
    } else {
      setFormValues((prevValues) => {
        const updatedValues = [...prevValues];
        updatedValues[index] = { ...updatedValues[index], [name]: value };
        return updatedValues;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const answersArray = selectedSurvey.questions.map((question, index) => ({
        questionId: question._id,
        answer: formValues[index][`question_${index}`],
      }));

      const response = await api.post('/answers', {
        surveyId: selectedSurvey._id,
        answers: answersArray
      })

      console.log(response.data.message);

      setSuccessMessage('Submitted Successfully. Thank you!');

      setTimeout(() => {
        setSuccessMessage('');
        navigate('/');
      }, 1000);

      setFormValues([]);
    } catch (error) {
      console.error("Error submitting answers: ", error);
      setErrorMessage(error.response.data.message);
    }
  };

  const getClassName = (className) => {
    switch(className) {
      case 'short-text':
        return "input focus:input-bordered w-full max-w-md border-black";
      case 'long-text':
        return "textarea focus:textarea-bordered w-full max-w-md border-black";
      case 'number':
        return 'input input-bordered w-full max-w-md border-black';
      case 'yes-no':
        return 'radio';
      default:
        return '';
    }
  }

  const renderInputField = (question, index) => {
    const questionId = `question_${index}`;
    const fieldName = `question_${index}`;
  
    if (question.questionType === 'yes-no') {
      return (
        <div className="hero-box w-full p-4 rounded-xl mb-4 flex justify-center items-center">
          <div className="w-full flex justify-start items-start p-2 gap-2">
            <p className="text-3xl font-semibold">{index + 1}</p>
            <div className="text-lg flex flex-col justify-start items-start gap-2">
              <label htmlFor={questionId}>{question.questionText}</label>
              <div className="flex flex-col justify-start items-start gap-4">
                <label htmlFor={questionId} className="flex flex-row justify-center items-center gap-2">
                  <input
                    required
                    type="radio"
                    id={questionId}
                    name={fieldName}
                    value="Yes"
                    className="radio"
                    checked={formValues[index]?.[fieldName] === 'Yes'}
                    onChange={(event) => handleChange(event, index)}
                  />
                  Yes
                </label>
                <label htmlFor={questionId} className="flex flex-row justify-center items-center gap-2">
                  <input
                    required
                    type="radio"
                    id={questionId}
                    name={fieldName}
                    value="No"
                    className="radio"
                    checked={formValues[index]?.[fieldName] === 'No'}
                    onChange={(event) => handleChange(event, index)}
                  />
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      let inputType;
      switch (question.questionType) {
        case 'short-text':
          inputType = 'text';
          break;
        case 'long-text':
          inputType = 'textarea';
          break;
        case 'number':
          inputType = 'number';
          break;
        default:
          inputType = 'text';
          break;
      }
  
      return (
        <div className="hero-box w-full p-4 rounded-xl mb-4 flex items-center justify-center">
          <div className="w-full flex justify-start items-start p-2 gap-2">
            <p className="text-3xl font-semibold">{index + 1}.</p>
            <div className="text-lg flex flex-col justify-start items-start gap-2 w-full">
              <label htmlFor={questionId}>{question.questionText}</label>
              <input
                required
                type={inputType}
                id={questionId}
                name={fieldName}
                className={getClassName(question.questionType)}
                value={formValues[index]?.[fieldName] || ''}
                onChange={(event) => handleChange(event, index)}
              />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full flex justify-center items-center flex-col mt-2 mb-10">
      {successMessage && <SuccessToast message={successMessage} />}
      {errorMessage && <ErrorToast message={errorMessage} />}
      {isLoading ? <span className="loading loading-spinner loading-lg"></span> :
        (
          <div className='w-full flex flex-col justify-between items-center'>
            <div className="flex md:flex-row flex-col justify-between items-center w-[75%] p-4">
              <div className="flex flex-col justify-center items-start gap-1">
                <h1 className="font-bold text-4xl">{selectedSurvey.surveyName}</h1>
                {userLoading ? <span className="loading loading-spinner loading-sm"></span> : <p className="font-light tracking-widest">{selectedSurvey.surveyCreatorUsername}</p>}
                <div className="flex md:flex-row flex-col gap-2">
                  <p className="bg-stone-200 px-3 py-1.5 rounded-xl text-sm"># {selectedSurvey.surveyTag}</p>
                </div>
              </div>
              <div className="py-2 px-4 w-80 flex justify-center items-center gap-2 bg-stone-800 text-white rounded-xl">
                <p className="font-semibold text-2xl text-center">Reward points: <span className='text-green-500 font-bold'>{selectedSurvey.balanceReward}</span></p>
              </div>
            </div>

            <div className="w-[65%] p-4 rounded-xl hero-box flex flex-col justify-center items-center gap-4">
              <form className='w-full' onSubmit={handleSubmit}>
                {selectedSurvey.questions.map((question, index) => (
                  <div key={index} className="flex justify-center items-center flex-col w-full">
                    {renderInputField(question, index)}
                  </div>
                ))}
                <div className="w-full flex md:flex-row flex-col justify-end items-center gap-4">
                  <Link to='/'>
                    <button type='button' className="btn bg-black text-white w-52 text-lg hover:border-black hover:text-black hover:bg-white">
                      Cancel
                    </button>
                  </Link>
                  <button type='submit' className="btn w-52 bg-green-600 text-white text-lg hover:border-green-600 hover:text-green-600 hover:bg-white">
                    Submit
                  </button>
                </div>
              </form>
            </div>

          </div>
        )
      }
    </div>
  )
}

export default SurveyPage