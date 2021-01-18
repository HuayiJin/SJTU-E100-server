/*点击弹出按钮*/
function popBoxSuffix(idSuffix) {
  // var popBox = document.getElementById("popBox");
  // var popLayer = document.getElementById("popLayer");
  // popBox.style.display = "block";
  // popLayer.style.display = "block";
  $("#popLayer").show();
  $("#popBox"+idSuffix).show("normal");
};

/*点击关闭按钮*/
function closeBoxSuffix(idSuffix) {
  // var popBox = document.getElementById("popBox");
  // var popLayer = document.getElementById("popLayer");
  // popBox.style.display = "none";
  // popLayer.style.display = "none";
  $("#popLayer").hide();
  $("#popBox"+idSuffix).hide("normal");

}

function addTableRow(idSuffix){
  // var tabNode = $("#table"+idSuffix);
  var tabNode = document.getElementById("table"+idSuffix);
  console.log(tabNode)

  console.log(tabNode.rows)
  var colNum = tabNode.rows[1].cells.length;

  var trNode=tabNode.insertRow();

  for(i = 0; i < colNum; ++i){
    console.log('in')
    var tdNode=trNode.insertCell();
    tdNode.innerHTML = "<div class='ui input'> <input type='text' placeholder='请输入'> </div>";
  }
}