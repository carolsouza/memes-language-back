import { Request, Response } from 'express';

export const codeExec = async (request: Request, response: Response) => {

    console.log(request)
    const fs = require('fs');
    const comp = require('./compiler.js');

    var randomName = 'demo'

    // Escrevendo a stdin
    fs.writeFile(randomName + ".txt", '', function (error: any) {
        // Se ocorrer erro, retorna a resposta
        if (error) {
            response.send(JSON.stringify({
                error: "ERRO INTERNO PAI!\n",
                stdout: null,
            }));
        }

        // Se não, escreve o código em um .c com nome aleatorio
        //e chama compiler

        fs.writeFile(randomName + ".c", request.params.code, function (err: any) {
            // se ocorrer erro, retorna JSON 
            if (err) {
                response.send(JSON.stringify({
                    error: "ERRO INTERNO PAI!\n",
                    stdout: null,
                }));
                return;
            }
            // caso contrário, compila e executa
            process.nextTick(function () {
                comp(randomName, response);

                const exec = require('child_process').exec;
                const fs = require('fs');

                //compila com o gcc
                exec('gcc ' + randomName + '.c -o ' + randomName + ' -lm && timeout 2s ./' + randomName + ' < ' + randomName + '.txt', function (error: any, stdout: any, stderr: any) {
                    //se houver erro de compilação, respondemos a requisição com um erro.
                    // res.setHeader('Content-Type', 'application/json');

                    if (error) {
                        console.log("ERROR: " + error);
                        response.send(JSON.stringify({
                            error: "CODEI PRA CARALHO MAS NÃO COMPILOU!\n",
                            stdout: null
                        }));
                    }
                    else {
                        console.log("STDOUT: " + stdout);
                        response.send(JSON.stringify({
                            error: null,
                            stdout: stdout
                        }));
                    }
                })
                    .on('close', function () {
                        exec('rm ' + randomName + '*', function (error: any, stdout: any, stderr: any) {
                            console.log('-----------------------------------------');
                            console.log("REMOVING FILES");
                        });
                    });
            });
        });
    });
}