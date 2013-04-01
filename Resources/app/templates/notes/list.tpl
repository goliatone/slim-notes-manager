<div class="row-fluid section-heading">
    <h2>Notes</h2>
    <a href="#!/note/create" class="btn btn-success right" type="button">
        <i class="icon-plus icon-white"></i>    Create Note
    </a>    
</div>
<div class="row-fluid">
    <div id="notes-holder" class="span">
        {{#notes}}
		<div id="note-{{id}}" class="note-holder row-fluid Widget" data-widget="note">
		    <div class="span note-entry">
		        <div class="btn-group actions" data-parent-id="{{id}}">
		            <button type="button" class="btn action-toolbar-btn" data-action="preview"><i class="icon-eye-open"></i></button>
		            <button type="button" class="btn action-toolbar-btn" data-action="edit"><i class="icon-edit"></i></button>
		            <button type="button" class="btn action-toolbar-btn" data-action="delete"><i class="icon-trash"></i></button>
		        </div>
		        <h3>{{title}}</h3>
		        <div>{{date}}</div>
		        <p>{{content}}</p>
		    </div>
		</div>
		{{/notes}}
    </div>
    <div class="push"></div>
    <div class="pagination Widget" data-widget='pagination'>
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


<!-- Modal -->
<div id="note-delete-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3 id="myModalLabel">Delete Note</h3>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete item?</p>
  </div>
  <div class="modal-footer">
    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
    <button class="btn btn-danger" id="note-delete-modal-btn">Delete</button>
  </div>
</div>