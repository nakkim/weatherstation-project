import React from 'react';
import './App.css';
import Latest from './components/Latest'
import Graph from './components/Graph'
import dataService from "./services/data"
import translations from './translations'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'fi',
      message: 'Ladataan havaintoja...'
    }
  }

  componentDidMount() {
    this.setState({ message: translations[this.state.lang].loading })
    this.getData();
    this.interval = setInterval(this.getData, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getData = () => {
    dataService
      .getAll()
      .then(data => {
        this.setState({ data })
      })
      .catch(error => {
        if (error.response) {
          console.log(error)
          this.setState({ message: "Havaintoja ei saatu ladattua" })
        }
      })
  }

  changeLanguage = (event) => {
    if(this.state.lang === 'fi') {
      this.setState({lang: 'en'})
      localStorage.setItem('lang', 'en')
    } else {
      this.setState({lang: 'fi'})
      localStorage.setItem('lang', 'fi')
    }
  }

  render() {
    const obs = this.state.data[0]

    return (
      <div className="App">
        <header>
          <div className="header-content">
            <span className="header-title">{translations[this.state.lang].title}</span>
          </div>
          <span className="language-selector">
            <a href="#" className="lang" onClick={this.changeLanguage}>{this.state.lang.toUpperCase()}</a>
          </span>
        </header>
        <Latest obs={obs} lang={this.state.lang} message={this.state.message} />
  
        <div className="main-content">
          <div className="graph-container" id="graph-container">
            <Graph data={this.state.data} lang={this.state.lang} />
          </div>
        </div>
        <div className="info-content">
          <div className="info-content bold">Arduino WiFi2</div>
          <div className="info-content light">React, MongoDB, Javascript, PHP, C/C++</div>
        </div>
  
        <footer>&reg; 2019- Ville Ilkka</footer>
      </div>
    );
  }
}

export default App
