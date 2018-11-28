// @flow
import React from 'react';

export default class ABEditor extends React.Component{

    render() {
        return (
            <div>
                <iframe id="edit-frame" src="http://localhost:3000" style={{width: '100%', height: '850px'}}></iframe>
            </div>
        );
    }

}
