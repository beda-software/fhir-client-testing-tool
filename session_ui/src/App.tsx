import { useEffect, useState } from 'react';
import './App.css'
import Search from 'antd/es/input/Search'
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { config } from './config';

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [serverUrl, setServerUrl] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    if (serverUrl !== '') {
      setLoading(true);
      axios.post(`${config.backendUrl}/sessions`, { target: serverUrl })
        .then(response => {
          setSessionId(response.data.id);
          setLoading(false);
        })
        .catch(error => {
          message.error('Failed to load data');
          setLoading(false);
        });
    }
  }, [serverUrl]);

  useEffect(() => {
    if (sessionId){
      navigate(`/${sessionId}`)
    }
  }, [navigate, sessionId])

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={'https://sparked.csiro.au/wp-content/uploads/2024/02/cropped-Standard-HL7-Logo-V1-_Orange-PRIMARY-LOGO-100x100.png'} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>FHIR Client testing tool</h1>
      <div className="card">
        <Search placeholder="https://au-core.beda.software/fhir" enterButton="Start" size="large" loading={loading} onSearch={(e) => setServerUrl(e)} />
      </div>
    </>
  )
}

export default App
