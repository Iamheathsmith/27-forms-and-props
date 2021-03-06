import './styles/main.scss'

import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL = `https://www.reddit.com/r/`;

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      num: '',

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({topic: e.target.value});
  }

  handleLimitChange(e) {
    this.setState({num: e.target.value});
  }


  handleSubmit(e) {
    e.preventDefault();
    this.props.update_state(this.state.topic, this.state.num);
  }


  render() {
    return (
      <form
        className='search_form'
        onSubmit={this.handleSubmit}>

        <h1>WELCOME TO REDDIT SEARCH</h1>
        <div className='box'>
        <input className={this.props.error ? 'error' : 'input'}
          type='text'
          name='topic'
          value={this.state.topic}
          onChange={this.handleChange}
          placeholder='pick your topic'/>

        <input className={this.props.error ? 'error' : 'input'}
          type='number'
          max='100'
          name='limit'
          value={this.state.num}
          onChange={this.handleLimitChange}
          placeholder='pick your topic'/>
        </div>
        <button type='submit'>Search</button>

      </form>
    )
  }
}


class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='results'>
        {this.props.topic ?
          <section className='topic-data'>
            {console.log(this.props.topic)}
            <h2> Results for {this.props.topic.data.children[0].data.subreddit}</h2>
            <ul>
              {this.props.topic.data.children.map((a, b) => {
                return <li key={b}>
                <a href={a.data.url}><h2>{a.data.title}</h2></a>
                <p> Ups: {a.data.ups}</p>
              </li>;
              })
            }
            </ul>
          </section>
          :
          undefined
        }

        {this.props.error ?
          <section className='topic-error'>
            <h2>You broke it.</h2>
          </section>
          :
          undefined
        }
      </div>
    );
  }
}




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: null,
      searchError: null,
    };
    this.searchApi = this.searchApi.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  updateState(topic, num) {
    this.searchApi(topic, num)
      .then(res => this.setState({topic: res.body, searchError: null}))
      .catch(err => this.setState({topic: null, searchError: err}));
  }

  searchApi(topic, num) {
    return superagent.get(`${API_URL}${topic}.json?limit=${num}`);
  }

  render() {
    return (
      <div className='application'>
        <SearchForm update_state={this.updateState} error={this.state.searchError}/>
        <Results topic={this.state.topic} error={this.state.searchError}/>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));