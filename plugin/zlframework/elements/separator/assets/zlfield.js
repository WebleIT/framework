/**
 * @package     ZOOlanders
 * @version     3.3.16
 * @author      ZOOlanders - http://zoolanders.com
 * @license     GNU General Public License v2 or later
 */

!function(e){var t=function(){};t.prototype=e.extend(t.prototype,{name:"ZOOtoolsSeparatorZLField",options:{enviroment:""},initialize:function(t,n){this.options=e.extend({},this.options,n);var i=this,o=i.options.enviroment;e(document).ready(function(){"zoo-type-edit"==o&&e(".ui-sortable").on("sortstop",function(e,t){$element=t.item,$element_position=$element.closest("ul.element-list").data("position"),$element_type=$element.find(".zlinfo").data("element-type"),"separator"==$element_type&&($element.addClass("zl-separator"),i.initOranizerTitle($element))}).find("li.element").each(function(){e(this).parent().trigger("sortstop",{item:e(this)})}),"zoo-type-edit"==o&&e(".col-left ul.element-list").on("element.added",function(t,n){e(n).parent().trigger("sortstop",{item:e(n)})}),("zoo-type-assignment"==o||"zoo-type-assignment-submission"==o)&&e(".element-list.unassigned li.element, .element-list[data-position=unassigned] li.element").each(function(){$element=e(this),$element_type=$element.find(".zlinfo").data("element-type"),"separator"==$element_type&&($element.addClass("zl-separator"),"zoo-type-assignment-submission"!=o&&e(".element-list.unassigned")[0]&&$element.draggable("disable").removeClass("ui-state-disabled"),$element.find(".name span").remove())}),"zoo-type-assignment-submission"==o&&e(".element-list[data-position=unassigned]").sortable({cancel:".element.zl-separator"})})},initOranizerTitle:function(e){if(!e.data("zootools-actions-inited")){var t=e.find(".zlfield .row[data-id=_layout] select"),n=e.find(".name");t.on("loaded.zlfield",function(){var t=e.find(".zlfield .row[data-id=name] input");t.on("keyup zlinit",function(){n.html(t.val())}).trigger("zlinit")}).trigger("loaded.zlfield"),e.data("zootools-actions-inited",!0)}}}),e.fn[t.prototype.name]=function(){var n=arguments,i=n[0]?n[0]:null;return this.each(function(){var o=e(this);if(t.prototype[i]&&o.data(t.prototype.name)&&"initialize"!=i)o.data(t.prototype.name)[i].apply(o.data(t.prototype.name),Array.prototype.slice.call(n,1));else if(!i||e.isPlainObject(i)){var a=new t;t.prototype.initialize&&a.initialize.apply(a,e.merge([o],n)),o.data(t.prototype.name,a)}else e.error("Method "+i+" does not exist on jQuery."+t.name)})}}(jQuery);