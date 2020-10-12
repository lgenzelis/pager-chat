import React, { useState } from 'react';

import './styles.css';

export function Login() {
  const [username, setUsername] = useState('');

  return (
    <div className="OuterContainer">
      <div className="LoginContainer">
        <div className="LoginTitle">Join chat</div>

        <form action="/chat">
          <label>
            <div className="LoginLabel">Please enter your username</div>
            <div className="LoginInputContainer">
              <input
                type="text"
                className="LoginNameInput"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                name="username"
                autoFocus
              />
            </div>
          </label>
          <div className="LoginNextContainer">
            <input type="submit" value="Next" className="LoginNextButton" disabled={!username} />
          </div>
        </form>
      </div>
    </div>
  );
}
