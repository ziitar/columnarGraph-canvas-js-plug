(function(window,document){
    var ChartDraws = function(options){
        if(!(this instanceof ChartDraws))return new ChartDraws(options);
        this.options = $.extend({
            //报表所需的参数
            "containerId" : "",  //canvas所在容器id
            "canvasWidth" : 400,    //canvas的宽
            "canvasHeight" : 300,   //canvas的高
            "paddingLeft" : 20,     //左右内边距
            "paddingTop" : 20,      //上下内边距
            "isNeedXLine":false,    //是否需要X轴
            "isNeedTap":false,      //是否需要柱形顶部显示值
            "isNeedTitle":false,        //是否需要x轴每个柱形的名称
            "isNeedColumnBackground":false,     //是否需要柱状背景
            "isNeedLineChart" : true,   //是否需要折线图
            "xLineColor":'#fff',    //X轴颜色
            "columnBackgroundColor":'#e7e7e7', //背景柱状颜色
            "axisColor" : "white",  //坐标轴颜色
            "lineChartColor" : "#90EE90", //折线图颜色，当isNeedLineChart=true时有效
            "fontSize":20,      //字体大小
            "axisBorderWidth":2,    //线段宽度及圈点的半径
            "columnChartWidth":25,  //柱形宽度
            "columnChartData" :[{NO:1,PT:0.4,Name:'xxx'}], //柱形图的数量和对应得名称以及百分比
            "lineDataList" : [{value:0.1}],    //折线的值
            "yChartData" :[],   //y轴的数量及名称
            "columnChartColor" : [{NO:0,color:'#fff'}], //柱形图颜色
        },options);

        var self = this;
        _init();
        function _init(){
            var canvasDom = document.createElement("canvas");
            canvasDom.id = self.options.containerId+"_"+"canvas";
            canvasDom.width = self.options.canvasWidth;
            canvasDom.height = self.options.canvasHeight;
            canvasDom.style.width="100%";
            document.getElementById(self.options.containerId).appendChild(canvasDom);
            self.context = document.getElementById(self.options.containerId+"_"+"canvas");
            self.ctx = self.context.getContext("2d");
        }
        _drawCoordinatePoints();
        function _drawCoordinatePoints() {
            self.reactAngleWidth = (1 - 2 * 0.02) * (self.options.canvasWidth - (2 * self.options.paddingLeft)) / (self.options.columnChartData.length * 2 -1);
            // var average=(1 - 2 * 0.04) * (self.options.canvasWidth - (2 * self.options.paddingLeft)) / (self.options.columnChartData.length*2-1);
            // self.reactAngleWidth = average>self.options.columnChartWidth?self.options.columnChartWidth:average;
            self.lineDataList = [];
            var value;
            for (var i = 0; i < self.options.columnChartData.length; i++) {
                value=self.options.lineDataList[i]?self.options.lineDataList[i].value:1;
                self.lineDataList.push({
                    x: 2 * self.options.columnChartData[i].NO * self.reactAngleWidth + self.options.paddingLeft + 0.02 * (self.options.canvasWidth - (2 * self.options.paddingLeft)) + self.reactAngleWidth/2,
                    y: self.options.canvasHeight - (10+self.options.paddingTop + (self.options.canvasHeight - 2 * self.options.paddingTop) * value)
                })
            }
            _drawColumnChart();
        }
        function _drawColumnChart(){
            //柱形图循环
            var reactAngleTimer = 1;
            function loopColumnChart()
            {
                var columnChartLooped = window.requestAnimationFrame(loopColumnChart);
                if(reactAngleTimer<=100)
                {
                    self.ctx.clearRect(0,0,self.options.canvasWidth,self.options.canvasHeight-self.options.paddingTop-10);
                    for(var k=0;k<self.options.columnChartData.length;k++)
                    {
                        if(self.options.isNeedColumnBackground){
                            drawRectangle(self.ctx,self.lineDataList[k].x-self.reactAngleWidth/4,self.options.canvasHeight-((self.options.canvasHeight-2*self.options.paddingTop)*reactAngleTimer/100+self.options.paddingTop+self.options.fontSize/2),self.options.columnChartWidth,(self.options.canvasHeight-2*self.options.paddingTop)*reactAngleTimer/100,self.options.columnBackgroundColor);
                        }
                        drawRectangle(self.ctx,self.lineDataList[k].x-self.reactAngleWidth/4,self.options.canvasHeight-((self.options.canvasHeight-2*self.options.paddingTop)*self.options.columnChartData[k].PT*reactAngleTimer/100+self.options.paddingTop+self.options.fontSize/2),self.options.columnChartWidth,(self.options.canvasHeight-2*self.options.paddingTop)*self.options.columnChartData[k].PT*reactAngleTimer/100,self.options.columnChartColor[k]?self.options.columnChartColor[k].color:self.options.columnChartColor[0].color);
                        if(self.options.isNeedTap){
                            drawXText(self.ctx,self.lineDataList[k].x,((self.options.canvasHeight-2*self.options.paddingTop)*self.options.columnChartData[k].PT*reactAngleTimer/100+self.options.paddingTop+self.options.fontSize/2),parseInt(self.options.columnChartData[k].PT*reactAngleTimer));
                        }
                    }
                    reactAngleTimer++;
                }
                else
                {
                    window.cancelAnimationFrame(columnChartLooped);
                    columnChartLooped = null;
                    reactAngleTimer = 1;
                    if(self.options.isNeedLineChart){
                        loopLineChart();
                    }
                }
            }
            loopColumnChart();
            //折线图循环
            var lineTimer = 0;
            function loopLineChart()
            {
                var lineChartLooped = window.requestAnimationFrame(loopLineChart);
                if(lineTimer<self.lineDataList.length-1)
                {
                    self.ctx.lineWidth = 2*self.options.axisBorderWidth;
                    if(lineTimer == 0)
                    {
                        drawCircle(self.ctx,self.lineDataList[lineTimer].x,self.lineDataList[lineTimer].y);
                    }
                    drawCircle(self.ctx,self.lineDataList[lineTimer+1].x,self.lineDataList[lineTimer+1].y);
                    self.ctx.beginPath();
                    self.ctx.moveTo(self.lineDataList[lineTimer].x,self.lineDataList[lineTimer].y);
                    self.ctx.lineTo(self.lineDataList[lineTimer+1].x,self.lineDataList[lineTimer+1].y);
                    self.ctx.strokeStyle = self.options.lineChartColor;
                    self.ctx.lineWidth =self.options.axisBorderWidth;
                    self.ctx.stroke();
                    lineTimer++;
                }
                else
                {
                    window.cancelAnimationFrame(lineChartLooped);
                    lineChartLooped = null;
                    lineTimer = 0;
                }
            }
            //画柱形图
            function drawRectangle(context,x,y,width,height,color){
                context.beginPath();
                context.fillStyle=color;
                context.fillRect(x,y,width,height);
            }
            //画圆
            function drawCircle(context,x,y){
                context.beginPath();
                context.arc(x,y,self.options.axisBorderWidth,0,2*Math.PI,true);
                context.strokeStyle=self.options.lineChartColor;
                context.stroke();
                context.closePath();
            }
        }
        if(self.options.isNeedTitle){
            for(var k=0;k<self.options.columnChartData.length;k++){
                drawXText(self.ctx,self.lineDataList[k].x,self.options.canvasHeight-((self.options.canvasHeight-2*self.options.paddingTop)+self.options.paddingTop+self.options.fontSize),self.options.columnChartData[k].Name);
            }
        }
        if(self.options.isNeedXLine){
            drawXLine(self.ctx,0,self.options.canvasHeight-((self.options.canvasHeight-2*self.options.paddingTop)+self.options.paddingTop+self.options.fontSize),self.options.canvasWidth,self.options.canvasHeight-((self.options.canvasHeight-2*self.options.paddingTop)+self.options.paddingTop+self.options.fontSize));
        }

        function drawXLine(ctx,x,y,lineToX,lineToY) {
            ctx.strokeStyle=self.options.xLineColor;
            ctx.lineWidth=self.options.axisBorderWidth;
            ctx.beginPath();
            ctx.moveTo(x,self.options.canvasHeight-self.options.paddingTop-y+10);
            ctx.lineTo(lineToX,self.options.canvasHeight-self.options.paddingTop-lineToY+10);
            ctx.stroke();
        }
        //画x轴title
        function drawXText(context,x,y,str) {
            context.beginPath();
            context.font = '{fontSize} Microsoft Yahei'.replace("{fontSize}",self.options.fontSize+"px");
            context.fillStyle = self.options.axisColor;
            context.textAlign = 'center';
            context.fillText(str,x,self.options.canvasHeight-y);
            context.closePath();
        }
    };
    window.ChartDraws = ChartDraws;
}(window,document));