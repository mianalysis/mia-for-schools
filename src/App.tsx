import { Route, Router } from '@solidjs/router';

import WorkflowSelector from './pages/WorkflowSelector';
import Workflow from './pages/Workflow';
import Intro from './pages/Welcome';

function App() {
  const App = (props) => <>{props.children}</>;

  return (
    <Router root={App} base="/mia-for-schools">
      <Route path="/" component={Intro} />
      <Route path="/workflows" component={WorkflowSelector} />
      <Route path="/workflow" component={Workflow} />
    </Router>
  );
}

export default App;
