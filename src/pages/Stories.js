import Axios from 'axios';
import { useEffect, useState } from 'react';
import { AuthData } from '../auth/AuthWrapper';
import '../paper.css'

export const Stories = () => {
  const { user } = AuthData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    const fetchData = async () => {
      try {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          headers: {
            'Authorization': 'Bearer ' + user.token,
          }
        };
        if (user.roles[0] === 'client_admin') {
          config.url = 'http://localhost:8081/api/stories'
        } else {
          config.url = 'http://localhost:8081/api/client-stories/' + user.roles[0]
        }
        Axios.request(config)
        .then((response) => {
          console.log(response.data);
          setData(response.data)
          setLoading(false);
        })
        // setLoading(false); // Stop loading once both requests are completed
      } catch (err) {
        setError('Error fetching data');
        setLoading(false); // Stop loading in case of an error
      }
    };
    fetchData();
  }, []);

  const goToSpecificStory = (id) => {
    window.location.href = "http://localhost:3000/story/" + id;
    console.log(id)
  }

  const navigateToNewStoryPage = () => {
    window.location.href = "http://localhost:3000/createnewstory"
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Stories</h2>
        <button className="btn btn-primary" onClick={navigateToNewStoryPage}>Create New Story
        </button>
      </div>
      <div className="row">
        {data.map((x, y) => (
          <div key={y} className="col-lg-4 col-md-6 mb-4">
            <div className="card shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => goToSpecificStory(x.id)}>
              <img style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }} src={x.url}></img>
              <div className="card-body">
                <h5 className="card-title">{x.title}</h5>
                <p className="card-text">{x.content}</p>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Written by {x.username}</span>
                  <span className="text-muted">{new Date(x.date).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}