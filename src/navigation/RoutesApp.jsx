import { Switch, Route } from "react-router-dom";

import Layout from '../components/layout/Layout';

const RoutesApp = () => {
    return (
        <Switch>
            <Route path='/' >
                <Layout/>

            </Route>
        </Switch>
    )
}
export default RoutesApp;