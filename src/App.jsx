import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Main from './component/Main';
import Login from './component/Login';
import Navigation from './component/Navigation';
import Inventory from './component/Inventory';
import CookingForm from './component/CookingForm';
import CookingList from './component/CookingList';
import CookingDetail from './component/CookingDetail';

const App = () => {
  const [islogin, setIslogin] = useState(false);

  useEffect(() => {
    if(JSON.parse(sessionStorage.getItem('islogin'))){
      setIslogin(true)
    }
  }, [])

  return(
    <Router basename={'/'}>
      <Navigation islogin={islogin} setIslogin={setIslogin} />
      <main>
        <div className="layoutWrap">
          <Switch>
            <Redirect from="/weeklyRestaurant" to="/" />
            <Route exact path="/">
              <Main 
                islogin={islogin}
              />
            </Route>
            <Route path="/login">
              {islogin 
                ? <Redirect to="/"/>
                : <Login setIslogin={setIslogin} />
              }
            </Route>
            <Route 
              path="/cookingList/:cookingId" 
              render={()=><CookingDetail islogin={islogin} />}
            />
            <Route path="/cookingList">
              <CookingList />
            </Route>
            <Route path="/cookingForm/:cookingId" component={CookingForm} />
            <Route path="/cookingForm">
              <CookingForm />
            </Route>
            <Route path="/inventory">
              <Inventory />
            </Route>
          </Switch>
        </div>
      </main>
      <footer><div className="layoutWrap">Copyright &copy; 2020 - 2021</div></footer>
    </Router>
  )
}

export default App;