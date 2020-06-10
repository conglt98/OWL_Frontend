import React, {Component} from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';
import './PageTitle.css'
import { Button } from 'reactstrap';
class PageTitle extends Component {

    render() {
        let {
            heading,
            icon,
            subheading
        } = this.props;
        const linkEdit=`#/events/${this.props.eventId}/edit`
        return (
            <React.Fragment>
            {this.props.mode!=='view'?<span></span>:
            <Button className='edit-btn' size='md' href={linkEdit} color="success"><strong><i className="fa fa-edit"></i> Edit event</strong></Button>}
            <div className="app-page-title">
                <div className="page-title-wrapper">
                    <div className="page-title-heading">
                        <div
                            className={cx("page-title-icon", {'d-none': false})}>
                            <i className={icon}/>
                        </div>
                        <div>
                            {heading}
                            <div
                                className={cx("page-title-subheading", {'d-none': false})}>
                                {subheading}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(PageTitle);

