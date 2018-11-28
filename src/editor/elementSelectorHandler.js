import $ from 'jquery';
import 'jquery-ui';
import pm from 'post-robot';

class ElementSelectorHandler {
    constructor() {
        console.log('init main element selector handler');
        this.pmTarget = null;
    }

    addOverlay = () => {
        this.selectElementOverlay = $('<div/>', {
            id: 'selectElementOverlay'
        }).appendTo('body');
    };

    removeOverlay = () => {
        this.selectElementOverlay.hide();
        pm.send(this.pmTarget, 'removeElemOverlay')
    };

    handleElementSelected = (selectedElement) => {
        this.selectedElement = selectedElement;
        this.pageOverlay();
    };

    pageOverlay = () => {
        this.selectElementOverlay.show();
    };

    setCustomMenu = function (data) {
        let parentMenu;
        // set slider images
        this.sliderImages = data.sliderImages;

        $('#element-tagName').text(data.tagName);

        // seçilen element slider ise

        $('.slider-settings').hide();
        $('.track-slider').hide();
        $('.track-element').show();

        if (data.imgSrc !== undefined) {
            $('.change-image').show();
        }
        else {
            $('.change-image').hide();
        }

        if (data.editHyperLink) {
            $('.edit-hyper-link').show();
            $('.make-hyper-link').hide();
        }
        else if (data.makeHyperLink) {
            $('.edit-hyper-link').hide();
            $('.make-hyper-link').show();
        }
        else {
            $('.edit-hyper-link').hide();
            $('.make-hyper-link').hide();
        }

        if ((data.children && data.children.length > 0) || data.tagName === 'img' || data.tagName === 'input') {
            $('.edit-text').hide();
        }
        else {
            $('.edit-text').show();
        }

        // parents selector menu
        $('#element-parents .subMenu').empty();
        let parentCount = 0;
        $.each(data.parents, function (i, v) {
            if (v.tagName === 'BODY' || v.tagName === 'HTML' || i === 0) { // 0. index elementin kendisi
                return; // continue
            }

            const parentMenu = document.createElement('span');
            $(parentMenu)
                .addClass('subMenuText')
                .addClass('sub-element-select')
                .html(v.tagName)
                .attr('data-selector', v.selectorString)
                .appendTo('#element-parents .subMenu');

            parentCount++;

        });


        if (parentCount < 1) {
            parentMenu = document.createElement('span');
            $(parentMenu)
                .addClass('subMenuText')
                .html('None')
                .appendTo('#element-parents .subMenu');
        }


        // children selector menu
        $('#element-children .subMenu').empty();
        $.each(data.children, function (i, v) {

            const parentMenu = document.createElement('span');
            $(parentMenu)
                .addClass('subMenuText')
                .addClass('sub-element-select')
                .html(v.tagName)
                .attr('data-selector', v.selectorString)
                .appendTo('#element-children .subMenu');

        });

        if (data.children < 1) {
            parentMenu = document.createElement('span');
            $(parentMenu)
                .addClass('subMenuText')
                .html('None')
                .appendTo('#element-children .subMenu');
        }
        console.log('show menu please');
        $('#select-element-menu').css({
            position: "absolute",
            top: data.position.y,
            left: data.position.x
        }).show();
    };

    closeElementMenu = () => {
        this.removeMenu();
        this.removeOverlay();
    };

    removeMenu = () => {
        $('#select-element-menu').hide();
    };

    setEvents = () => {
        const container = $('body');

        // element select menu draggable
        $('#select-element-menu').draggable({
            handle: '.select-element-menu-handle',
            create: function () {
                $('#select-element-menu').css({'position': 'absolute'});
            }
        });

        container.on('click', '#selectElementOverlay', () => {
            this.removeMenu();
            this.removeOverlay();
        });
    };

}

export default new ElementSelectorHandler();