/** @namespace Holds functionality for automatically managing the layout of OpenTok streams */
var LayoutContainer = function() {
	/** @private */
	var Width;
	
	/** @private */
	var Height;
	
	/** @private */
	var containerId;	
	
	/** @scope LayoutContainer */
	return {
		/**
		 * Initializes the LayoutContainer.  Must be called prior to any other functions.
		 * @param {String} divId ID of DIV to be used as the container.
		 * @param {int} width Width of container DIV.
		 * @param {int} height Height of container DIV.
		 */
		init: function(divId, width, height){
			containerId = divId;
			Width = width;
			Height = height;
		},
		
		/**
		 * Updates the container to incorporate any added or removed streams.
		 */
		layout: function(){
			var subscriberBox = document.getElementById(containerId);
			subscriberBox.style.position = "relative";
			subscriberBox.style.width = Width + "px";
			subscriberBox.style.height = Height + "px";
			var vid_ratio = 3/4;

			// Find ideal ratio
			var count = subscriberBox.children.length;
			var min_diff;
			var targetCols;
			var targetRows;
			var availableRatio = Height / Width;
			for (var i=1; i <= count; i++) {
				var cols = i;
				var rows = Math.ceil(count / cols);
				var ratio = rows/cols * vid_ratio;
				var ratio_diff = Math.abs( availableRatio - ratio);
				if (!min_diff || (ratio_diff < min_diff)) {
					min_diff = ratio_diff;
					targetCols = cols;
					targetRows = rows;
				}
			};

			var videos_ratio = (targetRows/targetCols) * vid_ratio;

			if (videos_ratio > availableRatio) {
				targetHeight = Math.floor( Height/targetRows );
				targetWidth = Math.floor( targetHeight/vid_ratio );
			} else {
				targetWidth = Math.floor( Width/targetCols );
				targetHeight = Math.floor( targetWidth*vid_ratio );
			}

			var spacesInLastRow = (targetRows * targetCols) - count;
			var lastRowMargin = (spacesInLastRow * targetWidth / 2);
			var lastRowIndex = (targetRows - 1) * targetCols;

			var firstRowMarginTop = ((Height - (targetRows * targetHeight)) / 2);
			var firstColMarginLeft = ((Width - (targetCols * targetWidth)) / 2);
			
			var x = 0;
			var y = 0;
			for (i=0; i < subscriberBox.children.length; i++) {
				if (i % targetCols == 0) {
					// We are the first element of the row
					x = firstColMarginLeft;
					if (i == lastRowIndex) x += lastRowMargin;
					y += i == 0 ? firstRowMarginTop : targetHeight;
				} else {
					x += targetWidth;
				}
				
				var parent = subscriberBox.children[i];
				var child = subscriberBox.children[i].firstChild;
				
				parent.style.position = "absolute";
				parent.style.left = x + "px";
				parent.style.top = y + "px";
				
				child.width = targetWidth;
				child.height = targetHeight;
				
				parent.style.width = targetWidth + "px";
				parent.style.height = targetHeight + "px";
			};
		},
		/**
		 * Adds a stream to the layout container
		 * @param {String} divId The ID of the DIV container that is passed to session.subscribe()
		 */
		addStream: function(divId) {
			var container = document.createElement("div");
			var div = document.createElement("div");
			div.setAttribute('id', divId);
			container.appendChild(div);
			
			var subscriberBox = document.getElementById(containerId);
			subscriberBox.appendChild(container);			
		},
		
		/**
		 * Removes a stream from the layout container
		 * @param {String} subscriberId The ID of the subscriber object from the stream to be removed.
		 */
		removeStream: function(subscriberId) {
			var obj = document.getElementById(subscriberId);
			var container = obj.parentNode;
			container.parentNode.removeChild(container);
		}
	};
}();