/**




 */

!function(e){var t=function(){};e.extend(t.prototype,{name:"ElementRepeatablePro",options:{msgDeleteElement:"Delete Element",msgSortElement:"Sort Element",msgLimitReached:"Limit reached",instanceLimit:"",url:""},initialize:function(t,n){this.options=e.extend({},this.options,n);var a=this,i=e("ul.repeatable-list",t),l=e("li.hidden",i).remove(),s=i.children("li.repeatable-element").length;a.element=t,a.list=i,a.count=s,a.options.msgAddInstance=e("p.add a",t).html(),i.children("li.repeatable-element").each(function(){e(this).children().wrapAll(e("<div>").addClass("repeatable-content")),a.attachButtons(e(this))}),i.on("mousedown",".zlux-x-sort",function(){e(".more-options.show-advanced",i).removeClass("show-advanced"),i.height(i.height()),e(this).closest("li.repeatable-element").find(".more-options").hide().end().find(".file-details").hide()}).on("mouseup",".zlux-x-sort",function(){e(this).closest("li.repeatable-element").find(".more-options").show().end().find(".file-details").show()}).on("click",".zlux-x-delete",function(){var n=e(this).closest("li.repeatable-element");n.fadeOut(200,function(){e(this).remove(),t.trigger("instance.deleted",[n]),a.options.instanceLimit&&e("p.add a",t).removeClass("disabled").html(a.options.msgAddInstance)})}).sortable({handle:".zlux-x-sort",placeholder:"repeatable-element dragging",axis:"y",opacity:1,delay:100,cursorAt:{top:16},tolerance:"pointer",containment:"parent",scroll:!1,start:function(t,n){n.item.addClass("ghost"),n.placeholder.height(n.item.height()-2),n.placeholder.width(e("div.repeatable-content",n.item).width()-2)},stop:function(t,n){n.item.removeClass("ghost"),e(".more-options",n.item).show(),e(".file-details",n.item).show(),i.height(""),a.updateIndexes(e(t.target))}}),e("p.add a",t).on("click",function(){return!(a.options.instanceLimit&&a.options.instanceLimit<=i.children().length)&&(a.addElementInstance(l.html()),void(a.options.instanceLimit&&a.options.instanceLimit<=i.children().length&&e("p.add a",t).addClass("disabled").html(a.options.msgLimitReached)))})},loadElementInstance:function(t,n){var a=this;e.ajax({url:a.options.ajax_url+"&task=callelement",type:"POST",data:{method:"getemptylayout",layout:t},success:function(e){a.addElementInstance(e),a.element.trigger("instance.added",[e,n])}})},addElementInstance:function(t){var n=this;if(n.list.hasClass("repeatable-list-level2")){var a=new RegExp(/(?:elements\[\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\])\[(-?\d+)\]/),i=a.exec(e('[name^="elements"]',n.list).first().attr("name")).pop();t=t.replace(/(elements\[\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\])(\[-?\d+\])/g,"$1["+i+"]"),t=t.replace(/(elements\[\S+])\[(-?\d+)\]/g,"$1["+n.count++ +"]")}else t=t.replace(/(elements\[\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\])(\[-?\d+\])/g,"$1["+n.count++ +"]");t=t.replace(/\[zluxvar-1\]/g,n.count),t=e('<li class="repeatable-element"><div class="repeatable-content">'+t+"</div></li>"),n.attachButtons(t),e("input, textarea",t).filter(function(){return"hidden"!=e(this).attr("type")}).each(function(){e(this).val("").html("")}),t.appendTo(n.list),t.children("div.repeatable-content").effect("highlight",{},1e3)},attachButtons:function(t){e(".zlux-x-sort, .zlux-x-delete",t)[0]||(e("<span>").addClass("zlux-x-sort sort").attr("title",this.options.msgSortElement).appendTo(t),e("<span>").addClass("zlux-x-delete delete").attr("title",this.options.msgDeleteElement).appendTo(t))},updateIndexes:function(t){var n=this;if(n.list.hasClass("repeatable-list-level2"))var a=new RegExp(/(elements\[\S+])\[(-?\d+)\]/);else var a=new RegExp(/(elements\[\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\])(\[-?\d+\])/);n.list.children("li.repeatable-element").each(function(t){e('[name^="elements"]',e(this)).each(function(){var n=e(this).attr("name").replace(a,"$1["+t+"]");e(this).attr("name",n)})})}}),e.fn[t.prototype.name]=function(){var n=arguments,a=n[0]?n[0]:null;return this.each(function(){var i=e(this);if(t.prototype[a]&&i.data(t.prototype.name)&&"initialize"!=a)i.data(t.prototype.name)[a].apply(i.data(t.prototype.name),Array.prototype.slice.call(n,1));else if(!a||e.isPlainObject(a)){var l=new t;t.prototype.initialize&&l.initialize.apply(l,e.merge([i],n)),i.data(t.prototype.name,l)}else e.error("Method "+a+" does not exist on jQuery."+t.name)})}}(jQuery);