import Axios from 'axios';
import { useEffect, useState } from "react";
import { AuthData } from "../auth/AuthWrapper";


export const SpecificStory = () => {
  const { user } = AuthData();
  const [loading, setLoading] = useState(true);
  const [storyId, setStoryId] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectedCommentText, setSelectedCommentText] = useState("")
  const [previouslyOpenedCommentId, setPreviouslyOpenedCommentId] = useState(null)

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = () => {
    var newCommentObject = {
      comment: newComment,
      username: user.name
    }
    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Authorization': 'Bearer ' + user.token,
      }
    };
    if (newComment !== "") {
      Axios.post("http://localhost:8081/stories/comments/addcomment/" + user.roles[0] + "/" + storyId, newCommentObject, config)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      })
      setComments([...comments, newComment]);
      setNewComment("");
    } else {
      console.log("Comment is empty")
    }
  };

  function makeInput(e) {
    if (previouslyOpenedCommentId !== null && e !== previouslyOpenedCommentId) {
      var previousComment = document.querySelectorAll('.comment')[previouslyOpenedCommentId];
      const previoussubmitButton = previousComment.querySelector("#submitChangesButton");
      const previouseditButton = previousComment.querySelector("#editButton");
      const previouscancelButton = previousComment.querySelector("#cancelButton");
      const previouscommentText = previousComment.querySelector("#commentText");
      const previousDeleteCommentText = previousComment.querySelector("#deleteButton");
      // Save the edited comment and revert back
      previoussubmitButton.hidden = true;
      previousDeleteCommentText.hidden = true;
      previouseditButton.hidden = false;
      previouscancelButton.hidden = true;
      // Update comment text with the edited content
      previouscommentText.innerHTML = `<p style="white-space: pre-line" id="commentText">${selectedCommentText}</p>`;
    }
    setPreviouslyOpenedCommentId(e);
    const comment = document.querySelectorAll('.comment')[e];
    const submitButton = comment.querySelector("#submitChangesButton");
    const editButton = comment.querySelector("#editButton");
    const cancelButton = comment.querySelector("#cancelButton");
    const commentText = comment.querySelector("#commentText");
    const previousDeleteCommentText = comment.querySelector("#deleteButton");
    if (submitButton.hidden) {
      setSelectedCommentText(commentText.innerText);
      console.log(selectedCommentText);
      submitButton.hidden = false;
      previousDeleteCommentText.hidden = false;
      editButton.hidden = true;
      cancelButton.hidden = false;
      commentText.innerHTML = `<input id="changedCommentText" style="white-space: pre-line" value="${commentText.innerText}" />`;
    } else {
      submitButton.hidden = true;
      previousDeleteCommentText.hidden = true;
      editButton.hidden = false;
      cancelButton.hidden = true;
      commentText.innerHTML = `<p style="white-space: pre-line" id="commentText">${selectedCommentText}</p>`;
    }
  }


  const submitChanges = (commentId, divIndex) => {
    var commentBody = {
      comment: document.getElementById("changedCommentText").value
    }
    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Authorization': 'Bearer ' + user.token,
      }
    };
    Axios.put("http://localhost:8081/stories/comments/" + user.roles[0] + "/" + storyId + "/" + commentId + "/" + user.name, commentBody, config)
      .then((resp) => {
        var comment = document.querySelectorAll('.comment')[divIndex];
        const submitButton = comment.querySelector("#submitChangesButton");
        const editButton = comment.querySelector("#editButton");
        const cancelButton = comment.querySelector("#cancelButton");
        const deleteCommentText = comment.querySelector("#deleteButton");
        submitButton.hidden = true;
        deleteCommentText.hidden = true;
        editButton.hidden = false;
        cancelButton.hidden = true;
      })
      .catch((err) => {
      })
  }
  
  const editPost = (id) => {
    window.location.href = "http://localhost:3000/changestory/" + id
  }

  const deleteComment = (id) => {
    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Authorization': 'Bearer ' + user.token,
      }
    };
    Axios.delete("http://localhost:8081/stories/comments/" + user.roles[0] + "/" + id + "/" + user.name, config)
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    setStoryId(window.location.href.split("/")[4]);
    const fetchData = async () => {
      try {
        let config = {
          maxBodyLength: Infinity,
          headers: { 
            'Authorization': 'Bearer ' + user.token,
          }
        };
        const [response1, response2] = await Promise.all([
          Axios.get('http://localhost:8081/api/stories/' + user.roles[0] + '/' + window.location.href.split("/")[4], config),
          Axios.get('http://localhost:8081/stories/comments/' + user.roles[0] + '/' + window.location.href.split("/")[4], config)
        ]);
        setData(response1.data)
        setComments(response2.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };
    fetchData();
  }, [comments]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
            <div className="text-center mb-3">
                <img src={data.url} alt="Story" className="img-fluid shadow-sm" style={{ maxHeight: '300px', objectFit: 'cover' }}/>
            </div>
            <h2 className="card-title mb-3">{data.title}</h2>
            <p style={{ whiteSpace: 'pre-line' }} className="card-text">{data.content}</p>
            <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Written by {data.username}</span>
                <span className="text-muted">{new Date(data.date).toLocaleDateString()}</span>
            </div>
            <div className="text-end">
                <p className="text-danger cursor-pointer" id="editButton" onClick={() => editPost(data.id)}>Edit post</p>
            </div>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="mb-4">Comments</h3>
          <div className="mb-4">
            <textarea value={newComment} onChange={handleCommentChange} placeholder="Add a comment..." className="form-control mb-3 border-0" rows="3" />
            <button onClick={handleAddComment} className="btn btn-primary w-100" disabled={!newComment.trim()}>Post Comment</button>
          </div>
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="comment mb-4 p-3 border-0 shadow-sm">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="font-weight-bold">{comment.username}</span>
                    <span className="text-muted">{new Date(comment.date).toLocaleDateString()}</span>
                  </div>
                  <p style={{ whiteSpace: 'pre-line' }} id="commentText">{comment.comment}</p>
                  {user.name === comment.username && (
                    <div className="d-flex justify-content-between mt-2">
                      <div className="d-flex gap-2">
                        <p className="text-success cursor-pointer" id="editButton" onClick={() => makeInput(index)}>Edit</p>
                        <p className="text-success cursor-pointer" id="cancelButton" hidden onClick={() => makeInput(index)}>Cancel</p>
                      </div>
                      <div className="d-flex gap-2">
                        <p className="text-success cursor-pointer" id="submitChangesButton" hidden onClick={() => submitChanges(comment.id, index)}>Submit changes</p>
                        <p className="text-danger cursor-pointer" id="deleteButton" hidden onClick={() => deleteComment(comment.id)}>Delete comment</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}