import { lazy } from 'solid-js';
import { Route, Router } from '@solidjs/router';

const WorkflowSelector = lazy(() => import('./pages/WorkflowSelector'));
const Workflow = lazy(() => import('./pages/Workflow'));
const Welcome = lazy(() => import('./pages/Welcome'));

function App() {
  const App = (props) => <>{props.children}</>;

  return (
    <Router root={App} base="/mia-for-schools">
      <Route path="/" component={Welcome} />
      <Route path="/workflows" component={WorkflowSelector} />
      <Route path="/workflow" component={Workflow} />
    </Router>
  );
}

export default App;
