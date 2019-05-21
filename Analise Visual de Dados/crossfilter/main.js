function exemplo1(){
    //criar o indice
    var cf = crossfilter(csv);

    //numero de itens no dataset
    console.log(cf.size());

    //
    var victimAgeDimension = cf.dimension(function(d){
	return d["Victim Age"];
    });

    console.log(victimAgeDimension.top(5));
    console.log(victimAgeDimension.bottom(5));

    //
    var ageDifferenceDimension = cf.dimension(function(d){
	return d["Perpetrator Age"] - d["Victim Age"];
    });

}

function exemplo2(){
    //criar o indice
    var cf = crossfilter(csv);

    //
    var victimAgeDimension = cf.dimension(function(d){
	return d["Victim Age"];
    });

    //
    victimAgeDimension.filter(function(age){
	return age>0 && age<130;
    });

    console.log(victimAgeDimension.top(5));

    //
    victimAgeDimension.filterAll();
    console.log(victimAgeDimension.top(5));
}

function exemplo3(){
    //criar o indice
    var cf = crossfilter(csv);

    //
    var weaponDimension = cf.dimension(function(d){
	return d["Weapon"];
    });

    var weaponGrouping = weaponDimension.group();
    
    //
    console.log(weaponGrouping.all());
}

function exemplo4(){
    //criar o indice
    var cf = crossfilter(csv);

    //
    var perpetratorSexDimension = cf.dimension(function(d){
	return d["Perpetrator Sex"];
    });

    perpetratorSexDimension.filter(function(s){
	return s == "Female";
    });
    
    //
    var weaponDimension = cf.dimension(function(d){
	return d["Weapon"];
    });

    var weaponGrouping = weaponDimension.group();
    
    //
    console.log(weaponGrouping.top(3));
}

function exemplo5(){
    //criar o indice
    var cf = crossfilter(csv);

    console.log(cf.groupAll().reduceSum(function(d){
	return d["Victim Count"];
    }).value());
}

function exercicio1(){
    //criar o indice
    var cf = crossfilter(csv);

    var stateDimension = cf.dimension(function(d){
	return d.state;
    });
    
    console.log(stateDimension.group().all());
}

function exercicio2(){
    //criar o indice
    var cf = crossfilter(csv);

    var stateDimension = cf.dimension(function(d){
	return d.state;
    });

    stateDimension.filter(function(x){
	return x == 'Alaska';
    });

    var pSexDimension = cf.dimension(function(d){
	return d["Perpetrator Sex"];
    });
    
    console.log(pSexDimension.group().all());
}

//exemplo5();
exercicio2();
