import React, { Component } from 'react';
import './App.css';
import shapeshift from './shapeshift';
import { Dropdown, Form, Input, Button, Container, Message } from 'semantic-ui-react';


class App extends Component {
  state = {
    coins: [],
    leftCoin: '',
    rightCoin: '',
    conversion: 0.0,
    done: false,
    show: false,
    amount: '',
    receive: '',
    refund: '',
    deposit: '',
    errorMessage: '',
    successMessage: '',
    receiveMessage: '',
    transactionMessage: '',
    transactionID: '',
    loading: false,
    loading2: false
  }

  async componentDidMount() {
    const coins = await shapeshift.getCoins();
    let coinsArray = [];
    for (let coin in coins) {
      coinsArray.push({key: coins[coin]['symbol'], value: coins[coin]['symbol'], text: coins[coin]['name'], image: coins[coin]['image']});
    }
    this.setState({coins:coinsArray});
  }
  equation = () => {
    const equation = this.state.conversion * this.state.amount;
    const coin = this.state.rightCoin;
    this.setState({receiveMessage: 'You will receive '+equation+' '+coin});
  }
  update = async () => {
    if (this.state.leftCoin !== '' && this.state.rightCoin !== '') {
      this.setState({show: true});
      const left = this.state.leftCoin.toLowerCase();
      const right = this.state.rightCoin.toLowerCase();
      const pair = left+'_'+right;
      const info = await shapeshift.getMarketInfo(pair);
      this.setState({conversion: info['rate']}, this.equation);
    }
  }
  onChangeLeft = async (event, data) => {
    this.setState({leftCoin: data.value}, this.update);
  }
  onChangeRight = async (event, data) => {
    this.setState({rightCoin: data.value}, this.update);
  }
  onChange = (event) => {
    this.setState({amount:event.target.value}, this.equation);
  }
  statusCheck = async () => {
    if(this.state.deposit != ''){
      this.setState({loading2:true});
      const result = await shapeshift.getStatus(this.state.deposit);
      if (result['status'] == 'no_deposits') {
        this.setState({transactionMessage: 'No deposit found yet.'});
      }
      if (result['status'] == 'received') {
        this.setState({transactionMessage: 'Deposit received, currently confirming'});
      }
      if (result['status'] == 'complete') {
        this.setState({transactionMessage: 'Deposit confirmed, coins sent out.'});
        this.setState({transactionID: result['transaction']});
      }
      if (result['status'] == 'failed') {
        this.setState({transactionMessage: 'Deposit has failed.'});
      }
      this.setState({loading2:false});
    }
  }
  onSubmit = async (event, data) => {
    event.preventDefault();
    this.setState({loading:true});
    if (this.state.leftCoin !== '' && this.state.rightCoin !== '') {
      const left = this.state.leftCoin.toLowerCase();
      const right = this.state.rightCoin.toLowerCase();
      const pair = left+'_'+right;
      try {
        const result = await shapeshift.shift(this.state.receive, this.state.refund, pair);
        this.setState({deposit: result['deposit']});
        this.setState({show: true});
        this.setState({successMessage: 'Your deposit address: ' + this.state.deposit});
      } catch (err) {
        this.setState({errorMessage: err.message});
      }
      this.setState({loading:false});
    }
    this.setState({loading:false});
  }
  render() {
    return (
      <div align="center">
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
        <h2>Shapeshift</h2>
        <div>
          <p>
            1 {this.state.leftCoin} = {this.state.conversion} {this.state.rightCoin}
          </p>
          <Dropdown placeholder='Select Coin To Sell' search selection options={this.state.coins} 
          onChange={this.onChangeLeft} />
          <Dropdown placeholder='Select Coin To Buy' search selection options={this.state.coins} 
          onChange={this.onChangeRight} />
        </div>
        <br />
        <br />
        <br />
        <br />
        <div>
          <Container>
            <Form onSubmit={this.onSubmit} success={!!this.state.successMessage} error={!!this.state.errorMessage}>
              <Form.Group>
                <Form.Field>
                  <Input
                    label="Amount to shift"
                    labelPosition="left"
                    value={this.state.amount}
                    onChange={event=>this.onChange(event)}
                    />
                </Form.Field>
                <Form.Field>
                  <Input
                    label="Your receiving address"
                    labelPosition="left"
                    value={this.state.receive}
                    onChange={event=>this.setState({receive:event.target.value})}
                    />
                </Form.Field>
                <Form.Field>
                  <Input
                    label="Your refund address"
                    labelPosition="left"
                    value={this.state.refund}
                    onChange={event=>this.setState({refund:event.target.value})}
                    />
                </Form.Field>
                <Button loading={this.state.loading} primary>
                  Shift
                </Button>
              </Form.Group>
              <br />
              <br />
              <Message content={this.state.receiveMessage} />
              <br />
              <br />
              <Message success header="Shift initiated." content={this.state.successMessage}>
              </Message>
              <Message error header="Something went wrong!" content={this.state.errorMessage}>
              </Message>
            </Form>
            <br />
            <br />
            <Button loading={this.state.loading2} content="Check transaction" onClick={this.statusCheck}/>
            <br />
            <br />
            <Message content={this.state.transactionMessage} />
          </Container>
        </div>
      </div>
    );
  }
}

export default App;
