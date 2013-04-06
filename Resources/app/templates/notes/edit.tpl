<div class="row-fluid section-heading">
            <h2>Edit Note</h2> 
        </div>
        <div class="row-fluid">
            <div class="span8">
                <div class="row-fluid">
                    <div class="panel">
                        <form id="post-form" class="well">
                            <input type="text" placeholder="Title" name="title" class="input span" />
                            <input type="text" placeholder="Slug" name="slug" class="input span" />
                      <br/>   
                            <textarea placeholder="Message" name="content"></textarea>
                            <div id="epiceditor"></div>
                        </form>
                        <div class="form-actions">
                          <button type="submit" class="btn btn-primary" id="create-note-save">
                            Save changes
                          </button>
                          <button type="button" class="btn" id="create-note-cancel">
                            Cancel
                          </button>
                        </div>
                        
                    </div>
                </div><!--/row-->
            </div><!--/span-->
            
            <div class="span4 well">
                <input type="text" placeholder="Date" name="date" class="input span datepicker" data-date-format="dd-mm-yyyy" data-provide="datepicker"/>
                <!-- <div class="row-fluid input-append datepicker" id="dp3" data-date="12-02-2012" data-date-format="dd-mm-yyyy">
                  <input class="span11" size="16" type="text" value="12-02-2012">
                  <span class="add-on"><i class="icon-th"></i></span>
                </div> -->
                <input type="text" placeholder="Tags" name="tags" class="input span" />
                <input type="text" placeholder="Categories" name="categories" class="input span" />
            </div><!--/span-->
         <div class="span4 well">
            <input type="text" placeholder="Name" name="field_name" class="input span" />
            <input type="text" placeholder="Value" name="categories" class="input span" />
            <button class="btn btn-success btn-block" id="create-note-add-parameter">
              <i class="icon-plus icon-white"></i>Add Parameter
            </button>
          </div><!--/span--> 
        </div><!--/row-->