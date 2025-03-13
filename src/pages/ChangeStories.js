import Axios from 'axios';
import { AuthData } from '../auth/AuthWrapper';
import { useEffect, useState } from 'react';

const ChangeStories = () => {

  const { user } = AuthData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [openId, setOpenId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openStoryContent, setOpenStoryContent] = useState([]);
  const [url, setUrl] = useState('')

  const handleSubmit = async (e) => {
    try {
      let headers = {
        headers: { 
          'Authorization': 'Bearer ' + user.token,
        }
      };

      let newData = {
        title: title,
        username: openStoryContent.username,
        content: content,
        url: url,
        date: openStoryContent.date,
        roleName: openStoryContent.roleName
      }
        
      Axios.put("http://localhost:8081/api/stories/changestory/" + user.roles[0] + "/" + openId, newData, headers)
        .then((response) => {
          setTitle('');
          setContent('');
          setUrl('');
          setOpenId(null);
          window.location.href = "http://localhost:3000/story/" + response.data.id;
        })
        .catch((err) => {
          setError('Error fetching data');
        });
    } catch (err) {
      console.error('Error submitting story:', err);
    }
  };

  const deleteStory = () => {
    let headers = {
      headers: { 
        'Authorization': 'Bearer ' + user.token,
        'Content-Type': 'application/json'
      }
    };
    Axios.delete('http://localhost:8081/api/stories/' + user.roles[0] + "/" + openId, headers)
    .then((response) => {
      console.log('Response:', response);
      window.location.href = "http://localhost:3000/stories";
    })
    .catch((err) => {
      setError(err)
    });
  }

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    const fetchData = async () => {
      try {
        setOpenId(window.location.href.split("/")[4])
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:8081/api/stories/' + user.roles[0] + '/' + window.location.href.split("/")[4],
          headers: {
            'Authorization': 'Bearer ' + user.token,
          }
        };
        Axios.request(config)
          .then((response) => {
            setOpenStoryContent(response.sendata);
            setTitle(response.data.title);
            setContent(response.data.content);
            setUrl(response.data.url);
          })
          .catch((error) => {
            if (error.status === 403) {
              setOpenStoryContent([]);
            }
          });
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };
      fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="page">
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-sm p-4 border-0 rounded-3">
              <h2 className="text-center mb-4 text-dark">Change story</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label text-muted">Story Title:</label>
                  <input type="text" id="title" className="form-control border-0 shadow-sm rounded-3 py-3" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                </div>
                <div className="mb-4">
                  <label htmlFor="content" className="form-label text-muted">Story Content:</label>
                  <textarea id="content" className="form-control border-0 shadow-sm rounded-3 py-3 " value={content} onChange={(e) => setContent(e.target.value)} required rows="6"/>
                </div>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label text-muted">Story Picture URL:</label>
                  <input type="text" id="title" className="form-control border-0 shadow-sm rounded-3 py-3" value={url} onChange={(e) => setUrl(e.target.value)} required/>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-lg shadow-sm rounded-3 px-5 py-3" disabled={isSubmitting}>
                    {isSubmitting ? 'Changing...' : 'Change Story'}
                  </button>
                  <button type="button" className="btn btn-danger btn-lg shadow-sm rounded-3 px-5 py-3 ms-3" onClick={() => deleteStory()}>Delete story</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeStories;