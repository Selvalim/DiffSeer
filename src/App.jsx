import React from 'react';
import './App.less';
import MSV2 from './components/MSV2';
import ProjectTimeLine from './components/ProjectTimeLine';

function App() {
  return (
    <div className="App">
        <ProjectTimeLine></ProjectTimeLine>
        <MSV2></MSV2>
    </div>
  );
}
  
  export default App;
