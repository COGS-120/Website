var what;
var name;
var toolName;
var indexOfTool;

var recipeData = $.getJSON("../json/instructions.json", function(result) {
	what = result;
	

			indexOfTool = 0;

			for (var i = 0; i < result.length; i++)
			{
				if (result[i].name == toolName)
				{
					indexOfTool = i;

				}
			}

	name = result[indexOfTool].name;
});

var index = 0;


function extractTool(tempTool) {
	toolName = tempTool;


}

