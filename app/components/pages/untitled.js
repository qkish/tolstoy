{/* getIdFromDB = () => {
           let email = this.props.routeParams.accountname;

      

        fetch('/api/v1/get_id_by_name', {
            method: 'post',
            mode: 'no-cors',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                csrf: $STM_csrf,
                email
                //json_meta: JSON.stringify({"ico_address": icoAddress})
            })
        }).then(r => r.json()).then(res => {
            if (res.error || res.status !== 'ok') {
                console.error('Get Id By Name Error', res.error);
                
                this.setState({server_error: res.error || translate('unknown'), loading: false});
            } else {
                this.setState({idFromDB: res.id});
              
       
                // this.props.loginUser(name, password);
                // const redirect_page = localStorage.getItem('redirect');
                // if (redirect_page) {
                //     localStorage.removeItem('redirect');
                //     browserHistory.push(redirect_page);
                // }
                // else {
                //     browserHistory.push('/@' + name);
                // }
            }
        }).catch(error => {
            console.error('Caught Get ID By Name Error', error);
            this.setState({server_error: (error.message ? error.message : error), loading: false});
        });
    } */}