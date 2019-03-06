import React from 'react';

const TesterItem = ({item}) => {
    function displayBugs() {
        if ( item.bugs.length == 0 ) {
            return '\u00A0';
        }

        let bugTitles = [];

        for ( let index = 0; index < item.bugs.length; index++ ) {
            bugTitles.push(item.bugs[index].title);
        }

        return bugTitles.join(',');
    }

    return (
        <tr>
            <td>{item.firstName}</td>
            <td>{item.lastName}</td>
            <td>{item.country}</td>
            <td>{displayBugs()}</td>
        </tr>
    );
};

export default TesterItem;