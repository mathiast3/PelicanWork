import BaseApp from 'base_app'; // ZAF v1 shims

  var App = {
    requests: {
        getMySites: function()
        {
            var email = this.currentUser().email();
            var externalId = this.currentUser().externalId();
            var username = "";
            if(this.user)
            {
                username = this.user().email();
            }
            else if(this.ticket)
            {
                if(this.ticket().requester)
                {
                        username = this.ticket().requester().email();
                }
            }
            return {
                url: 'https://mysites.officeclimatecontrol.net/ajaxMySites.cgi',
                type: 'POST',
                dataType: 'json',
                data: {
                    'request': 'getMySites',
                    'email': email,
                    'externalId': externalId,
                    'username': username
                }
            };
        },

        setAgentSite: function(siteName)
        {
            var email = this.currentUser().email();
            var externalId = this.currentUser().externalId();
            return {
                url: 'http://www.pelicanwireless.com/zendesk/ajaxDialer.cgi',
                type: 'POST',
                data: {
                    'request': 'setAgentSite',
                    'email': email,
                    'externalId': externalId,
                    'siteName': siteName
                }
            };
        },
    },

    events: {
      'app.activated': 'showMain',
      'getMySites.done': 'showMySites',
      'click .siteNameItem': 'siteNameHandler',
    },

    showMain: function() {
        this.switchTo('main', { });
        this.ajax('getMySites');
    },

    siteNameHandler: function(event)
    {
        var target = event.currentTarget;
        console.log("siteNameHandler: innerHTML=" + target.innerHTML);
        this.ajax('setAgentSite', event.currentTarget.innerHTML);
    },

    showMySites: function(data) {
        var localList = this.$('.siteList')[0];
        var sites = data.mySites;
        var optionsHtml = "";
        if(sites)
        {
            for(var i = 0;i < sites.length;i++)
            {
                optionsHtml += '<li>' +
                       '<div class="siteNameItem">' + sites[i].siteName + '</div>' +
                       '<div class="siteHost">' + sites[i].host + '</div>' +
              '</li>';
            }
        }
        localList.innerHTML = optionsHtml;
    }
  };

export default BaseApp.extend(App);
