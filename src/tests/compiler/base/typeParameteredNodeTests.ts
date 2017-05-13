﻿import {expect} from "chai";
import {TypeParameterStructure} from "./../../../structures";
import {TypeParameteredNode, TypeParameterDeclaration, FunctionDeclaration} from "./../../../compiler";
import {getInfoFromText} from "./../testHelpers";

describe(nameof(TypeParameteredNode), () => {
    describe(nameof<TypeParameteredNode>(n => n.getTypeParameters), () => {
        const {sourceFile} = getInfoFromText("function noTypeParamsFunc() {}\n function typeParamsFunc<T, U>() {}");
        const noTypeParamsFunc = sourceFile.getFunctions()[0];
        const typeParamsFunc = sourceFile.getFunctions()[1];

        describe("having no type parameters", () => {
            it("should return an empty array", () => {
                expect(noTypeParamsFunc.getTypeParameters().length).to.equal(0);
            });
        });

        describe("having type parameters", () => {
            it("should get the correct number of type parameters", () => {
                expect(typeParamsFunc.getTypeParameters().length).to.equal(2);
            });

            it("should have the right instance of", () => {
                expect(typeParamsFunc.getTypeParameters()[0]).to.be.instanceOf(TypeParameterDeclaration);
            });
        });
    });

    describe(nameof<TypeParameteredNode>(n => n.addTypeParameter), () => {
        function doTest(startCode: string, structure: TypeParameterStructure, expectedCode: string) {
            const {firstChild} = getInfoFromText<FunctionDeclaration>(startCode);
            firstChild.addTypeParameter(structure);
            expect(firstChild.getText()).to.equal(expectedCode);
        }

        it("should add when none exists", () => {
            doTest("function identifier() {}", { name: "T" }, "function identifier<T>() {}");
        });

        it("should add when one exists", () => {
            doTest("function identifier<T>() {}", { name: "U" }, "function identifier<T, U>() {}");
        });
    });

    describe(nameof<TypeParameteredNode>(n => n.addTypeParameters), () => {
        function doTest(startCode: string, structures: TypeParameterStructure[], expectedCode: string) {
            const {firstChild} = getInfoFromText<FunctionDeclaration>(startCode);
            firstChild.addTypeParameters(structures);
            expect(firstChild.getText()).to.equal(expectedCode);
        }

        it("should add multiple", () => {
            doTest("function identifier() {}", [{ name: "T" }, { name: "U" }], "function identifier<T, U>() {}");
        });
    });

    describe(nameof<TypeParameteredNode>(n => n.insertTypeParameter), () => {
        function doTest(startCode: string, insertIndex: number, structure: TypeParameterStructure, expectedCode: string) {
            const {firstChild} = getInfoFromText<FunctionDeclaration>(startCode);
            firstChild.insertTypeParameter(insertIndex, structure);
            expect(firstChild.getText()).to.equal(expectedCode);
        }

        it("should insert when none exists", () => {
            doTest("function identifier() {}", 0, { name: "T" }, "function identifier<T>() {}");
        });

        it("should insert at the start", () => {
            doTest("function identifier<T>() {}", 0, { name: "U" }, "function identifier<U, T>() {}");
        });

        it("should insert at the end", () => {
            doTest("function identifier<T>() {}", 1, { name: "U" }, "function identifier<T, U>() {}");
        });

        it("should insert in the middle", () => {
            doTest("function identifier<T, U>() {}", 1, { name: "V" }, "function identifier<T, V, U>() {}");
        });

        it("should insert with constraint", () => {
            doTest("function identifier<T, U>() {}", 1, { name: "V", constraint: "string" }, "function identifier<T, V extends string, U>() {}");
        });
    });

    describe(nameof<TypeParameteredNode>(n => n.insertTypeParameters), () => {
        function doTest(startCode: string, insertIndex: number, structures: TypeParameterStructure[], expectedCode: string) {
            const {firstChild} = getInfoFromText<FunctionDeclaration>(startCode);
            const result = firstChild.insertTypeParameters(insertIndex, structures);
            expect(result.length).to.equal(structures.length);
            expect(firstChild.getText()).to.equal(expectedCode);
        }

        it("should insert multiple", () => {
            doTest("function identifier<V>() {}", 0, [{ name: "T" }, { name: "U" }], "function identifier<T, U, V>() {}");
        });

        it("should do nothing if empty array", () => {
            doTest("function identifier() {}", 0, [], "function identifier() {}");
        });
    });
});
