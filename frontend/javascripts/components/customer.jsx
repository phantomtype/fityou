import React from 'react';

export default class CustomerBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }
  loadCommentsFromServer() {
    let url = '/api/v1/customers.json';
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(result) {
        this.setState({data: result.data});
      }.bind(this),
      error: function(xhr, status, err) {
        //console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
  handleCustomerSubmit(customer) {
    let url = '/api/v1/customers.json';
    this.setState({data: this.state.data.concat([customer])});
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'POST',
      data: customer,
      success: function(data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
  componentDidMount() {
    this.loadCommentsFromServer();
  }
  render() {
    return (
      <div className="customerBox">
        <h3>顧客管理</h3>
        <CustomerForm onCustomerSubmit={this.handleCustomerSubmit.bind(this)} />
        <CustomerList data={this.state.data} />
      </div>
    );
  }
};

class CustomerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {gender: "female"};
  }
  handleChange(elm, e) {
    var newState = {};
    newState[elm] = e;
    this.setState(newState);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onCustomerSubmit({customer: this.state});
    this.setState({});
    return;
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className="mdl-grid">
          <TextInput id="last_name" label="氏" col="3" handleChange={this.handleChange.bind(this)} />
          <TextInput id="first_name" label="名" col="3" handleChange={this.handleChange.bind(this)} />
        </div>
        <div className="mdl-grid">
          <TextInput id="last_name_kana" label="氏(かな)" col="3" handleChange={this.handleChange.bind(this)} />
          <TextInput id="first_name_kana" label="名(かな)" col="3" handleChange={this.handleChange.bind(this)} />
        </div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--4-col">
            <RadioGroup id="gender" labels={[{v: "female", l: "女性"}, {v: "man", l: "男性"}]} handleChange={this.handleChange.bind(this)} />
          </div>
        </div>
        <div className="mdl-grid">
            <DateInput id="birth" handleChange={this.handleChange.bind(this)} />
        </div>
        <div className="mdl-grid">
          <TextInput id="email" label="email" col="4" handleChange={this.handleChange.bind(this)} />
          <TextInput id="tel" label="tel" col="4" handleChange={this.handleChange.bind(this)} />
        </div>
        <div className="mdl-grid">
          <TextInput id="address" label="住所" width="550px" col="8" handleChange={this.handleChange.bind(this)} />
        </div>
        <div className="mdl-grid">
          <TextInput id="note" label="備考" col="8" handleChange={this.handleChange.bind(this)} />
        </div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--8-col">
            <button className="mdl-button mdl-js-button mdl-button--raised">Post</button>
          </div>
        </div>
      </form>
    );
  }
};

class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {year: "", month: "", day: ""};
  }
  handleChange(elm, e) {
    var newState = {};
    newState[elm] = e;
    this.setState(newState);
    if (this.state.year && this.state.month && this.state.day) {
      let date = new Date(this.state.year, this.state.month - 1, this.state.day)
      console.log(date)
      this.props.handleChange(this.props.id, date)
    }
  }
  render() {
    return (
      <div style={{display: "inherit"}}>
        <NumericInput id="year" label="生年" col="1" handleChange={this.handleChange.bind(this)} />
        <NumericInput id="month" label="生月" col="1" handleChange={this.handleChange.bind(this)} />
        <NumericInput id="day" label="生日" col="1" handleChange={this.handleChange.bind(this)} />
      </div>
    )
  }
}

class RadioGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'female'};
  }
  handleChange(elm, e) {
    this.setState({value: e.target.value});
    this.props.handleChange(this.props.id, e.target.value);
  }
  render() {
    let rs = this.props.labels.map((label) => {
      return (
        <label for={this.props.id} className="mdl-radio mdl-js-radio">
          <input
            className="mdl-radio__button"
            type="radio"
            value={label.v}
            id={label.v}
            checked={this.state.value == label.v}
            onChange={this.handleChange.bind(this, "")} />
          <span className="mdl-radio__label">{label.l}</span>
        </label>
      )
    });
    return (
      <div>
        {rs}
      </div>
    );
  }
};

class NumericInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ""};
  }
  handleChange(elm, e) {
    this.setState({value: e.target.value});
    this.props.handleChange(this.props.id, e.target.value);
  }
  render() {
    return (
      <div className={"mdl-cell mdl-cell--" + this.props.col + "-col"}>
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id={this.props.id}
               value={this.state.value} onChange={this.handleChange.bind(this, "")} />
        <label className="mdl-textfield__label" for={this.props.id}>{this.props.label}</label>
        <span className="mdl-textfield__error">数字を入力してください。</span>
      </div>
      </div>
    );
  }
};

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ""};
  }
  handleChange(elm, e) {
    this.setState({value: e.target.value});
    this.props.handleChange(this.props.id, e.target.value);
  }
  render() {
    return (
      <div className={"mdl-cell mdl-cell--" + this.props.col + "-col"}>
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style={{width: this.props.width}}>
        <input className="mdl-textfield__input" type="text" id={this.props.id}
               value={this.state.value} onChange={this.handleChange.bind(this, "")} />
        <label className="mdl-textfield__label" for={this.props.id}>{this.props.label}</label>
      </div>
      </div>
    );
  }
};

class CustomerList extends React.Component {
  render() {
    var nodes = this.props.data.map(function (customer) {
      return (
        <Customer customer={customer}>
        </Customer>
      );
    });
    return (
      <table className="mdl-data-table">
        <thead>
        <tr>
          <th>会員番号</th>
          <th>氏名</th>
          <th>かな</th>
          <th>性別</th>
          <th>年齢</th>
        </tr>
        </thead>
        <tbody>
        {nodes}
        </tbody>
      </table>
    );
  }
};

class Customer extends React.Component {
  render() {
    let c = this.props.customer;
    return (
      <tr>
        <td>{c.last_name} {c.first_name}</td>
        <td>{c.last_name_kana} {c.first_name_kana}</td>
      </tr>
    );
  }
};

