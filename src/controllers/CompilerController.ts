import { Request, Response } from 'express';

export const codeExec = async (request: Request, response: Response) => {

    console.log(request.body)
    let code = request.body.code;
    //Traduzindo a main
    code = code.replace(/(BORA BILL)(?=(?:[^"]|"[^"]*")*$)/g, 'int main (void) {');
    //Traduzindo o final
    code = code.replace(/(ISSO E TUDO PESSOAL)(?=(?:[^"]|"[^"]*")*$)/g, '}');
    //Traduzindo printf
    code = code.replace(/(QUEM E ELA[\?]?)(?=(?:[^"]|"[^"]*")*$)/g, 'printf');
    //Traduzindo if
    code = code.replace(/(SE EU FOR)(?=(?:[^"]|"[^"]*")*$)(.*)/g, 'if $2 ');
    //Traduzindo else
    code = code.replace(/(HOJE NAO FARO)(?=(?:[^"]|"[^"]*")*$)/g, ' else ');
    //Traduzindo else if
    code = code.replace(/(ENTAO EU VOU)(?=(?:[^"]|"[^"]*")*$)(.*)/g, ' else if $2 ');
    //Traduzindo while
    code = code.replace(/(ME CHAMA QUE EU VOU)(?=(?:[^"]|"[^"]*")*$)(.*)/g, 'while $2 ');
    //Traduzindo for
    code = code.replace(/(SE ME ATACA EU VO ATACA)(?=(?:[^"]|"[^"]*")*$)(.*)/g, 'for $2 ');
    //Traduzindo declaração de função
    code = code.replace(/(FINGE QUE EU NAO EXISTO)(?=(?:[^"]|"[^"]*")*$)(.*)(\))/g, '$2 ');
    //Traduzindo retorno da função
    code = code.replace(/(MIRELLA CORRE AQUI)(?=(?:[^"]|"[^"]*")*$)/g, 'return');
    //Traduzindo chamada de função
    code = code.replace(/(MUNIQUE EU VOU PASSAR MAL)(?=(?:[^"]|"[^"]*")*$)/g, ' ');
    //Traduzindo parada no código
    code = code.replace(/(QUIETINHA)(?=(?:[^"]|"[^"]*")*$)/g, 'break');
    //Traduzindo continuar o código
    code = code.replace(/(OLHA ELA)(?=(?:[^"]|"[^"]*")*$)/g, 'continue');

    //Traduzindo os tipos de dados
    code = code.replace(/(ATEMPORAL)(?=(?:[^"]|"[^"]*")*$)/g, 'char');
    code = code.replace(/(MEMORAVEL)(?=(?:[^"]|"[^"]*")*$)/g, 'int');
    code = code.replace(/(ESQUECIDO)(?=(?:[^"]|"[^"]*")*$)/g, 'float');

    //Colocando as bibliotecas
    code = "#include <stdio.h>\n#include <math.h>\n\n" + code;

    console.log(code)

    const fs = require('fs');

    var randomName = 'demo'

    const path = require('path');
    const filePath = path.dirname(__dirname) + '/controllers/'
    
    const exec = require('child_process').exec;

    // console.log(filePath)

    fs.writeFile('src/controllers/' + randomName + ".txt", '', function (error: any) {
        // Se tiver erro, retorna o erro
        if (error) {
            response.send(JSON.stringify({
                error: "HOJE NÃO FARO!\n",
                stdout: null,
            }));
        }

        // Se não, escreve o código em .c e chama compiler

        fs.writeFile('src/controllers/' + randomName + ".c", code, function (err: any) {
            // se ocorrer erro, retorna erro
            if (err) {
                response.send(JSON.stringify({
                    error: "HOJE NÃO FARO! ERRO INTERNO.\n",
                    stdout: null,
                }));
                return;
            }
            // se não, compila e executa
            process.nextTick(function () {

                //compila com o gcc
                exec('gcc ' + '-o ' + 'src/controllers/' + randomName + '.exe' + ' src/controllers/' + randomName + '.c' , function (error: any, stdout: any, stderr: any) {
                    //se houver erro de compilação, retorna erro.
                    if (error) {
                        console.log("ERROR: " + error);
                        response.send(JSON.stringify({
                            error: "ERRO DE COMPILAÇÃO, VERIFIQUE A DOCUMENTAÇÃO!\n",
                            stdout: null
                        }));
                    } else {
                        exec(filePath + randomName + '.exe', function(err: any, stdout: any, stderr: any) {
                            if(err) {
                                console.log(err)
                                return
                            }
                            response.send(JSON.stringify({
                                error: null,
                                stdout: stdout
                            }));
                        })
                    }
                })
                    
            });
        });
    });
}