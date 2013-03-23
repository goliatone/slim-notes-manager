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