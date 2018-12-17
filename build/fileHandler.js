/**
 * Created by lzq on 2017/10/18.
 */
const glob = require('glob');

exports.globPromise = function(pattern,options){
  return new Promise((resolve,reject)=>{

    glob(pattern,options,function(error,files){
      error === null ? resolve(files) : reject(error);
    });
  });
};

exports.getNpmCmdParams = function(mark){
  if (!mark) return;
  try{
    let pageName = [];
    let args = JSON.parse(process.env.npm_config_argv);
    if(args){
      args.original.forEach(function(val){
        if(val.match(/op*/g)){
          pageName.push(val.match(/op(.*)/g)[0].split('/')[1])
        }
      })

      return pageName
    }
  }catch(ex){
    console.log('getNpmCmdParams 错误 ：npm获取命令行参数错误')
  }
}

