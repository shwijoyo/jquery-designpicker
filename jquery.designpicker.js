(function ($) {
	let design = [];
    $.fn.designpicker = function (options) {
        let settings = $.extend(
            {
                pageat: 0,
                search: "",
                onPick: (design) => {
                    console.log(design);
                },
            },
            options
        );
        
        let $this = $(this).attr({ placeholder: $(this).attr("placeholder") != undefined ? $(this).attr("placeholder") : "Select Image", "data-bs-toggle": "modal", "data-bs-target": `#${$(this).attr("id")}-designpicker` });
        let id = `${$this.attr("id")}-designpicker`;
        let $main = $(`<div />`).addClass(`modal fade`).attr({ id: id, tabindex: "-1" });
        let element = () => {
            return `
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5">${$this.attr("placeholder")}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <input type="text" class="form-control form-control-sm" placeholder="search">

            <div class="container text-center mt-2">
                <div class="row align-items-start">
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col"></div>
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <nav>
                <ul class="pagination pagination-sm"></ul>
            </nav>
        </div>
    </div>
</div>

		`;
        };

        let render = () => {
            let $pagination = $main.find(".pagination");
            let data = [];
            $.each(design, (i,v)=>{
				if(String(v.tag).toLowerCase().includes(String(settings.search).toLowerCase())){
					data.push(v);
					}
				});
            let datashow = data.slice(settings.pageat * 24, settings.pageat * 24 + 24);
            $main.find("div.col").empty();
            
            let dd = []
            $.each(datashow, (i, v) => {
            	$.each(v.design, (k, l)=>{
            	dd.push({design: v.design[k], designdata: v.designdata[k]})
                });
            });
            $.each(dd, (i, v)=>{
            	if (i % 3 == 0) {
                    $main.find("div.col").eq(0).append(`
				<img src="https://cdn.jsdelivr.net/gh/shwijoyo/surotshirt.com@master/data/${v.slug}/${v.design}" class="img-fluid img-thumbnail mb-3" data-design="https://cdn.jsdelivr.net/gh/shwijoyo/surotshirt.com@master/data/${v.slug}/${v.designdata}" data-bs-dismiss="modal" loading="lazy" />
				`);
                }
            else if (i % 3 == 1) {
                    $main.find("div.col").eq(1).append(`
				<img src="https://cdn.jsdelivr.net/gh/shwijoyo/surotshirt.com@master/data/${v.slug}/${v.design}" class="img-fluid img-thumbnail mb-3" data-design="https://cdn.jsdelivr.net/gh/shwijoyo/surotshirt.com@master/data/${v.slug}/${v.designdata}" data-bs-dismiss="modal" loading="lazy" />
				`);
                }
             else {
                    $main.find("div.col").eq(2).append(`
				<img src="https://cdn.jsdelivr.net/gh/shwijoyo/surotshirt.com@master/data/${v.slug}/${v.design}" class="img-fluid img-thumbnail mb-3" data-design="https://cdn.jsdelivr.net/gh/shwijoyo/surotshirt.com@master/data/${v.slug}/${v.designdata}" data-bs-dismiss="modal" loading="lazy" />
				`);
                }
                
            });
            let pagelast = (data.length + (24 - (data.length % 24))) / 24 - 1;
            $pagination.empty();
            if (pagelast <= 4) {
                for (var i = 0; i <= pagelast; i++) {
                    $pagination.append(`<li class="page-item"><button class="page-link ${settings.pageat == i ? "active" : ""}" value="${i}">${i + 1}</button></li>`);
                }
            } else {
                if (settings.pageat < 4) {
                    for (var i = 0; i < 5; i++) {
                        $pagination.append(`<li class="page-item"><button class="page-link ${settings.pageat == i ? "active" : ""}" value="${i}">${i + 1}</button></li>`);
                    }
                    $pagination.append(`<li class="page-item"><button class="page-link" value="${pagelast}">&raquo; ${pagelast + 1}</button></li>`);
                } else if (settings.pageat >= pagelast - 3) {
                    $pagination.append(`<li class="page-item"><button class="page-link" value="1">1 &laquo;</button></li>`);
                    for (var i = pagelast - 4; i <= pagelast; i++) {
                        $pagination.append(`<li class="page-item"><button class="page-link ${settings.pageat == i ? "active" : ""}" value="${i}">${i + 1}</button></li>`);
                    }
                } else {
                    $pagination.append(`<li class="page-item"><button class="page-link" value="1">1 &laquo;</button></li>`);

                    for (var i = settings.pageat - 2; i < settings.pageat + 3; i++) {
                        $pagination.append(`<li class="page-item"><button class="page-link ${settings.pageat == i ? "active" : ""}" value="${i}">${i + 1}</button></li>`);
                    }

                    $pagination.append(`<li class="page-item"><button class="page-link" value="${pagelast}">&raquo; ${pagelast + 1}</button></li>`);
                }
            }
            $main.find(".page-link").on("click", function () {
                settings.pageat = Number(this.value);
                render();
            });
           $main.find("img.img-fluid").on("click", function () {
           let url = this.getAttribute("data-design");
               $this.val(url);
               $.getJSON(url,  function (data){
            	design = data;
                settings.onPick(design);
            });
                
            });
        };
        
        let event = () => {
        	let ti = null;
            $main.find(`input.form-control[type='text']`).on("input", function (){
		
		settings.pageat = 0;
		clearTimeout(ti);
		ti = setTimeout(()=>{
			settings.search = this.value;
		    render();
			}, 1500);
		});
        };
        (() => {
            $("body").append($main.append(element()));
            event();
             render();
            $.getJSON("https://cdn.jsdelivr.net/gh/shwijoyo/surotshirt.com@master/data.json", function (data){
            	$.each(data, (i, v)=>{
            	      if(v.designdata.length != 0){
            	          design.push(v);
                       }
                   });
            	
            
            	render();
            });
            
        })();
        return this;
    };
})(jQuery);
