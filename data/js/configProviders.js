$(document).ready(function(){

    $.fn.showHideProviders = function() {
        $('.providerDiv').each(function(){
            var providerName = $(this).attr('id');
            var selectedProvider = $('#editAProvider :selected').val();

            if (selectedProvider+'Div' == providerName)
                $(this).show();
            else
                $(this).hide();

        });
    } 

    $.fn.addProvider = function (id, name, url, key, isDefault, showProvider) {
        var $this = $(this),
            $componentGroup = $this.closest('.component-group'),
            providerType = $this.data().providerType,
            providerList = $componentGroup.data().providerList;

        if (url.match('/$') == null)
            url = url + '/';

        var newData = [isDefault, [name, url, key]];
        providerList[id] = newData;

        if (!isDefault)
        {
            $componentGroup.find('.editProvider').addOption(id, name);
            $this.populateProviderSection();
        }

        if ($('#providerOrderList > #'+id).length == 0 && showProvider != false) {
            var toAdd = '<li class="ui-state-default" id="'+id+'">'+
                '<input type="checkbox" id="enable_'+id+'" class="provider_enabler" CHECKED>'+
                '<a href="'+url+'" class="imgLink" target="_new">'+
                    '<img src="'+sbRoot+'/images/providers/'+providerType+'.gif" alt="'+name+'" width="16" height="16">'+
                '</a> '+name+'</li>'

            $('#providerOrderList').append(toAdd);
            $('#providerOrderList').sortable("refresh");
        }

        $this.makeProviderString();

    }

    $.fn.updateProvider = function (id, url, key) {
        var $this = $(this),
            $componentGroup = $this.closest('.component-group'),
            providerList = $componentGroup.data().providerList;

        providerList[id][1][1] = url;
        providerList[id][1][2] = key;

        $this.populateProviderSection();
        $this.makeProviderString();
    
    }

    $.fn.deleteProvider = function (id) {
        var $this = $(this),
            $componentGroup = $this.closest('.component-group'),
            providerList = $componentGroup.data().providerList;

        $componentGroup.find('.editProvider').removeOption(id);
        delete providerList[id];
        $this.populateProviderSection();

        $('#providerOrderList > #'+id).remove();

        $this.makeProviderString();

    }

    $.fn.populateProviderSection = function() {
        var $this = $(this),
            $componentGroup = $this.closest('.component-group'),
            providerList = $componentGroup.data().providerList;

        var selectedProvider = $componentGroup.find('.editProvider :selected').val();

        if (selectedProvider == 'addProvider') {
            var data = ['','',''];
            var isDefault = 0;
            $componentGroup.find('.provider-add-div').show();
            $componentGroup.find('.provider-update-div').hide();
        } else {
            var data = providerList[selectedProvider][1];
            var isDefault = providerList[selectedProvider][0];
            $componentGroup.find('.provider-add-div').hide();
            $componentGroup.find('.provider-update-div').show();
        }

        $componentGroup.find('.provider-name').val(data[0]);
        $componentGroup.find('.provider-url').val(data[1]);
        $componentGroup.find('.provider-key').val(data[2]);
        
        if (selectedProvider == 'addProvider') {
            $componentGroup.find('.provider-name').removeAttr("disabled");
            $componentGroup.find('.provider-url').removeAttr("disabled");
        } else {

            $componentGroup.find('.provider-name').attr("disabled", "disabled");

            if (isDefault) {
                $componentGroup.find('.provider-url').attr("disabled", "disabled");
                $componentGroup.find('.provider-delete').attr("disabled", "disabled");
            } else {
                $componentGroup.find('.provider-url').removeAttr("disabled");
                $componentGroup.find('.provider-delete').removeAttr("disabled");
            }
        }

    }
    
    $.fn.makeProviderString = function() {
        var $this = $(this),
            $componentGroup = $this.closest('.component-group'),
            providerList = $componentGroup.data().providerList;

        var provStrings = new Array();
        
        for (var id in providerList) {
            provStrings.push(providerList[id][1].join('|'));
        }

        var outstring = provStrings.join('!!!');
        console.log(outstring);
        $componentGroup.find('.provider-string').val(outstring)

    }
    
    $.fn.refreshProviderList = function() {
            var idArr = $("#providerOrderList").sortable('toArray');
            var finalArr = new Array();
            $.each(idArr, function(key, val) {
                    var checked = + $('#enable_'+val).prop('checked') ? '1' : '0';
                    finalArr.push(val + ':' + checked);
            });

            $("#provider_order").val(finalArr.join(' '));
    }

    $('[data-provider-type]').each(function(i,item){
        $(item).data({providerList: new Array()})
    })
//    var newznabProviders = new Array();
//    var friendProviders = new Array()

    $('.newznab_key').change(function(){

        var provider_id = $(this).attr('id');
        provider_id = provider_id.substring(0, provider_id.length-'_hash'.length);

        var url = $('#'+provider_id+'_url').val();
        var key = $(this).val();

        $(this).updateProvider(provider_id, url, key);

    });
    
    $('input.provider-info').change(function(){
        var $this = $(this),
            $componentGroup = $this.closest('.component-group'),
            providerList = $componentGroup.data().providerList;

        var selectedProvider = $componentGroup.find('.editProvider :selected').val();

        var url = $componentGroup.find('.provider-url').val();
        var key = $componentGroup.find('.provider-key').val();
        
        $this.updateProvider(selectedProvider, url, key);
        
    });
    
    $('#editAProvider').change(function(){
        $(this).showHideProviders();
    });

    $('#editANewznabProvider').change(function(){
        $(this).populateProviderSection();
    });
    
    $('.provider_enabler').live('click', function(){
        $(this).refreshProviderList();
    }); 
    

    $('#newznab_add').click(function(){
        
        var selectedProvider = $('#editANewznabProvider :selected').val();
        
        var name = $('#newznab_name').val();
        var url = $('#newznab_url').val();
        var key = $('#newznab_key').val();
        
        var params = { name: name }
        
        // send to the form with ajax, get a return value
        $.getJSON(sbRoot + '/config/providers/canAddNewznabProvider', params,
            function(data){
                if (data.error != undefined) {
                    alert(data.error);
                    return;
                }

                $(this).addProvider(data.success, name, url, key, 0);
        });


    });

    $('.newznab_delete').click(function(){
    
        var selectedProvider = $('#editANewznabProvider :selected').val();

        $(this).deleteProvider(selectedProvider);

    });

    // initialization stuff

    $(this).showHideProviders();

    $("#providerOrderList").sortable({
        placeholder: 'ui-state-highlight',
        update: function (event, ui) {
            $(this).refreshProviderList();
        }
    });

    $("#providerOrderList").disableSelection();

});