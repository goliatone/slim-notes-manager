<div class="row-fluid section-heading">
    <h2>Notes</h2>
    <a href="note-create.html" class="btn btn-success right" type="button">
        <i class="icon-plus icon-white"></i>    Create Note
    </a>    
</div>
<div class="row-fluid">
    <div id="notes-holder" class="span">
        {{#notes}}
		<div id="note-{{id}}" class="note-holder row-fluid">
		    <div class="span note-entry">
		        <div class="btn-group actions" data-parent-id="{{id}}">
		            <button type="button" class="btn"><i class="icon-eye-open"></i></button>
		            <button type="button" class="btn"><i class="icon-edit"></i></button>
		            <button type="button" class="btn"><i class="icon-trash"></i></button>
		        </div>
		        <h3>{{title}}</h3>
		        <div>{{date}}</div>
		        <p>{{content}}</p>
		    </div>
		</div>
		{{/notes}}
    </div>
    <div class="push"></div>
    <div class="pagination">
        <ul>
            <li><a href="#">&laquo;</a></li>
            <li><a href="#">1</a></li>
            <li><a href="#">2</a></li>
            <li><a href="#">3</a></li>
            <li><a href="#">4</a></li>
            <li><a href="#">5</a></li>
            <li><a href="#">&raquo;</a></li>
        </ul>
    </div><!--/span-->
</div><!--/row-->