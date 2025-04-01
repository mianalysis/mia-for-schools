import { Route, Router } from '@solidjs/router';

import WorkflowSelector from './pages/WorkflowSelector';
import Workflow from './pages/Workflow';

function App() {
  const App = (props) => <>{props.children}</>;

  return (
    <Router root={App}>
      <Route path="/" component={WorkflowSelector} />
      <Route path="/workflow" component={Workflow} />
    </Router>
  );
}

export default App;
