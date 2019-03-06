import React, { Component } from 'react';
import axios from 'axios';

import TesterItem from './TesterItem';

import {arraySort} from './globalFunctions';
import upArrow from './up-arrow.png';
import downArrow from './down-arrow.png';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.sortDirections = {
            asc: 'asc',
            desc: 'desc'
        };

        this.state = {
            testers: [],

            searchText: '',

            errorData: {
                error: false,
                errorText: 'Temporary error occurred, please try again later',
            },

            sortData: {
                byField: 'firstName',
                direction: this.sortDirections.asc
            },
            hasFirstSearch:false,
        };
    }

    changeErrorData(isError) {
        let errorData = {...this.state.errorData, error: isError};
        this.setState({errorData});
    }

    /**
     * This function updates the
     * search input field.
     *
     * @param event
     */
    searchTextChange = event => {
        if (  this.state.errorData.error) {
            this.changeErrorData(false);
        }

        this.setState({searchText: event.target.value});
    };

    /**
     * This function fetches the
     * testers from the server.
     *
     */
    fetchTesters() {
        let url = 'https://test-api.techsee.me/api/ex/' + this.state.searchText;
        let hasFirstSearch = true;
        axios.get(url).then( (response) => {
            if ( response.data == '' ) {
                this.setState({testers: [], hasFirstSearch});
            } else {
                if ( Array.isArray(response.data) ) {
                    let sortData = {byField: 'firstName', direction: this.sortDirections.asc};
                    let testers = response.data.sort(arraySort(this.sortDirections.asc, 'firstName'));
                    this.setState({testers, sortData, hasFirstSearch});
                } else {
                    let testers = [];
                    testers.push(response.data);
                    this.setState({testers,hasFirstSearch});
                }
            }
        },  (error) => {
            this.setState({testers: [], hasFirstSearch});
            this.changeErrorData(true);
        });

    }

    searchTesters(event) {
        event.preventDefault();

        if ( !this.validateSearchText() ) {
            return;
        }

        this.fetchTesters();
    }

    validateSearchText() {
        return (this.state.searchText.length >= 2 && this.state.searchText.length <= 12);
    }

    renderTesters() {
        let rows
        if (this.state.testers.length > 0) {
            rows = this.state.testers.map((item, index) => {
                // If the data had a unique field like id
                // the key would have been the field's value
                // and not index.
                return <TesterItem key={index} item={item} />;
            });
        } else if (this.state.hasFirstSearch){
            rows = <tr><td colSpan="4" style={{ color: 'red' }}> No results..</td></tr>
        }

        return <tbody>{rows}</tbody>;
    }

    sortField(byField) {
        // If there is only 1 tester then there is no need
        // to sort
        if ( this.state.testers.length <= 1 ) {
            return;
        }

        var sortDirection, sortData;

        if ( this.state.sortData.byField == byField ) {
            sortDirection = (this.state.sortData.direction == this.sortDirections.asc) ? this.sortDirections.desc : this.sortDirections.asc;
        } else {
            sortDirection = this.sortDirections.asc
        }

        sortData = {byField, direction: sortDirection};

        let testers = this.state.testers.sort(arraySort(sortDirection, byField));
        this.setState({testers, sortData});
    }

    /**
     * This function return indication
     * at the status of a sorted field
     *
     * @param fieldName
     * @returns {XML}
     */
    getSortedFieldImg(fieldName) {
        if ( this.state.testers.length <= 1 || this.state.sortData.byField != fieldName ) {
            return;
        }

        let srcImg = '';

        if ( this.state.sortData.direction == this.sortDirections.asc ) {
            srcImg = upArrow;
        } else {
            srcImg = downArrow;
        }

        return <img src={srcImg}/>;
    }

    /**
     * This function shows cursor
     * for editing field.
     *
     * @returns {*}
     */
    getThStyle() {
        // If there is only 1 tester then there is no need
        // to sort
        if ( this.state.testers.length > 1 ) {
            return {cursor: 'pointer'}
        } else {
            return {};
        }
    }

    /**
     * This function displays error
     * message if there is one.
     *
     * @returns {*}
     */
    getErrorStyle() {
        if ( this.state.errorData.error ) {
            return {};
        } else {
            return {display: 'none'};
        }
    }

    /**
     * This function set the input
     * color to red if it's not valid.
     *
     * @returns {*}
     */
    getSearchInputStyle() {
        if ( this.validateSearchText() ) {
            return {};
        } else {
            return {color: 'red'};
        }
    }

    render() {
        let thStyle = this.getThStyle();

        return (
            <div id="pageWrapper">
                <h1>Search Bugs</h1>

                <label>Tester Name:</label>
                <input type="text" className="input-style" style={this.getSearchInputStyle()} maxLength="12"
                       placeholder="Enter the tester name" value={this.state.searchText} onChange={this.searchTextChange}/>

                <button  type="submit" className="button-style" onClick={this.searchTesters.bind(this)} disabled={!this.validateSearchText()}>Fetch</button>

                <div className="error-text" style={this.getErrorStyle()}>{this.state.errorData.errorText}</div>

                <table className="table-striped">
                    <thead>
                    <tr className="first-row">
                        <th style={thStyle} onClick={this.sortField.bind(this, 'firstName')}>
                            First Name {this.getSortedFieldImg('firstName')}
                        </th>
                        <th style={thStyle} onClick={this.sortField.bind(this, 'lastName')}>
                            Last Name {this.getSortedFieldImg('lastName')}
                        </th>
                        <th style={thStyle} onClick={this.sortField.bind(this, 'country')}>
                            Country {this.getSortedFieldImg('country')}
                        </th>
                        <th style={{ width: '600px' }}>Bugs</th>
                    </tr>
                    </thead>

                    {this.renderTesters()}
                </table>
            </div>
        );
    }
}

export default App;